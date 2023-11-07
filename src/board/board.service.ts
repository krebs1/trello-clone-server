import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Board, BoardDocument } from './models/board.model'
import { Model, Types } from 'mongoose'
import { CreateBoardInput } from './dto/create-board.input'
import { RenameBoardInput } from './dto/rename-board.input'
import { CreateListInput } from './dto/create-list.input'
import { RenameListInput } from './dto/rename-list.input'
import { CreateCardInput } from './dto/create-card.input'
import { RenameCardInput } from './dto/rename-card.input'
import { DeleteListInput } from './dto/delete-list.input'
import { DeleteCardInput } from './dto/delete-card.input'
import { CreateLabelInput } from './dto/create-label.input'
import { EditLabelInput } from './dto/edit-label.input'
import { DeleteLabelInput } from './dto/delete-label.input'
import { AddLabelToCardInput } from './dto/add-label-to-card.input'
import { DeleteLabelFromCardInput } from './dto/delete-label-from-card.input'
import { AddMemberToBoardInput } from './dto/add-member-to-board.input'
import { DeleteMemberFromBoardInput } from './dto/delete-member-from-board.input'
import { ChangeCardOrderInput } from './dto/change-card-order.input'
import { MoveCardInput } from './dto/move-card.input'
import { ChangeCardDescriptionInput } from './dto/change-card-description.input'

@Injectable()
export class BoardService {
	constructor(
		@InjectModel(Board.name) private readonly model: Model<BoardDocument>,
	) {}

	//Board
	async findAllBoards(): Promise<Board[]> {
		return await this.model.find().exec()
	}

	async findBoardById(_id: string): Promise<Board> {
		return await this.model.findById(_id).exec()
	}

	async findBoardsByName(name: string): Promise<Board[]> {
		return await this.model.find({ name: name }).exec()
	}

	async findBoardByUserId(_id: string): Promise<Board[]> {
		return await this.model
			.find({
				members: {
					$elemMatch: { userId: new Types.ObjectId(_id) },
				},
			})
			.exec()
	}

	async createBoard(createBoardInput: CreateBoardInput): Promise<Board> {
		return await this.model.create({
			name: createBoardInput.name,
			members: { userId: new Types.ObjectId(createBoardInput.userId) },
		})
	}

	async renameBoard(renameBoardInput: RenameBoardInput): Promise<Board> {
		return await this.model
			.findByIdAndUpdate(
				renameBoardInput._id,
				{ name: renameBoardInput.name },
				{ new: true },
			)
			.exec()
	}

	async deleteBoard(_id: string): Promise<Board> {
		return await this.model.findByIdAndDelete(_id).exec()
	}

	//Board labels
	async createLabel(createLabelInput: CreateLabelInput): Promise<Board> {
		return await this.model
			.findByIdAndUpdate(
				createLabelInput.boardId,
				{
					$push: {
						labels: {
							colorId: new Types.ObjectId(createLabelInput.colorId),
							text: createLabelInput.text,
						},
					},
				},
				{ new: true, upsert: true },
			)
			.exec()
	}

	async editLabel(editLabelInput: EditLabelInput): Promise<Board> {
		return await this.model
			.findByIdAndUpdate(
				editLabelInput.boardId,
				{
					$set: {
						'labels.$[label].colorId': new Types.ObjectId(
							editLabelInput.colorId,
						),
						'labels.$[label].text': editLabelInput.text,
					},
				},
				{
					new: true,
					upsert: true,
					arrayFilters: [{ 'label._id': editLabelInput.labelId }],
				},
			)
			.exec()
	}

	async deleteLabel(deleteLabelInput: DeleteLabelInput): Promise<Board> {
		return await this.model
			.findByIdAndUpdate(
				deleteLabelInput.boardId,
				{
					$pull: {
						labels: {
							_id: deleteLabelInput.labelId,
						},
					},
				},
				{ new: true, upsert: true },
			)
			.exec()
	}

	//Lists
	async createList(createListInput: CreateListInput): Promise<Board> {
		return await this.model
			.findByIdAndUpdate(
				createListInput.boardId,
				{ $push: { lists: { name: createListInput.name } } },
				{ new: true },
			)
			.exec()
	}

	async renameList(renameListInput: RenameListInput): Promise<Board> {
		return await this.model
			.findOneAndUpdate(
				{
					_id: renameListInput.boardId,
					'lists._id': new Types.ObjectId(renameListInput.listId),
				},
				{
					$set: {
						'lists.$.name': renameListInput.name,
					},
				},
				{ new: true },
			)
			.exec()
	}

	async deleteList(deleteListInput: DeleteListInput): Promise<Board> {
		return await this.model
			.findOneAndUpdate(
				{
					_id: deleteListInput.boardId,
				},
				{
					$pull: {
						lists: { _id: deleteListInput.listId },
					},
				},
			)
			.exec()
	}

	//Card
	async findCardById(_id: string): Promise<Board> {
		const card = await this.model
			.aggregate([
				{ $unwind: '$lists' },
				{ $unwind: '$lists.cards' },
				{
					$match: {
						$expr: {
							$eq: ['$lists.cards._id', new Types.ObjectId(_id)],
						},
					},
				},
			])
			.exec()

		if (!card.length) return

		const lists = card[0].lists
		const cards = lists.cards

		return {
			...card[0],
			lists: [
				{
					...lists,
					cards: [
						{
							...cards,
						},
					],
				},
			],
		}
	}

	async changeCardOrder(
		changeCardOrderInput: ChangeCardOrderInput,
	): Promise<Board> {
		const list = await this.model
			.aggregate([
				{
					$match: {
						$expr: {
							$eq: ['$_id', new Types.ObjectId(changeCardOrderInput.boardId)],
						},
					},
				},
				{ $unwind: '$lists' },
				{
					$match: {
						$expr: {
							$eq: [
								'$lists._id',
								new Types.ObjectId(changeCardOrderInput.listId),
							],
						},
					},
				},
			])
			.exec()

		const firstCard = 'lists.$[list].cards.' + changeCardOrderInput.firstIndex
		const secondCard = 'lists.$[list].cards.' + changeCardOrderInput.secondIndex

		return await this.model
			.findByIdAndUpdate(
				changeCardOrderInput.boardId,
				{
					$set: {
						[firstCard]: list[0].lists.cards[changeCardOrderInput.secondIndex],
						[secondCard]: list[0].lists.cards[changeCardOrderInput.firstIndex],
					},
				},
				{
					new: true,
					upsert: true,
					arrayFilters: [{ 'list._id': changeCardOrderInput.listId }],
				},
			)
			.exec()
	}

	async moveCard(moveCardInput: MoveCardInput): Promise<Board> {
		const cardRes = await this.model
			.aggregate([
				{
					$match: {
						$expr: { $eq: ['$_id', new Types.ObjectId(moveCardInput.boardId)] },
					},
				},
				{ $unwind: '$lists' },
				{
					$match: {
						$expr: {
							$eq: [
								'$lists._id',
								new Types.ObjectId(moveCardInput.sourceListId),
							],
						},
					},
				},
				{ $unwind: '$lists.cards' },
				{
					$match: {
						$expr: {
							$eq: [
								'$lists.cards._id',
								new Types.ObjectId(moveCardInput.sourceCardId),
							],
						},
					},
				},
			])
			.exec()

		const card = cardRes[0].lists.cards
		await this.deleteCard({
			boardId: moveCardInput.boardId,
			listId: moveCardInput.sourceListId,
			cardId: moveCardInput.sourceCardId,
		})

		return await this.model
			.findOneAndUpdate(
				{
					_id: moveCardInput.boardId,
					'lists._id': moveCardInput.destinationListId,
				},
				{
					$push: {
						'lists.$.cards': {
							$each: [card],
							$position: moveCardInput.destinationIndex,
						},
					},
				},
				{ new: true, upsert: true },
			)
			.exec()
	}

	async createCard(createCardInput: CreateCardInput): Promise<Board> {
		return await this.model
			.findOneAndUpdate(
				{ _id: createCardInput.boardId, 'lists._id': createCardInput.listId },
				{
					$push: {
						'lists.$.cards': {
							name: createCardInput.name,
						},
					},
				},
				{ new: true, upsert: true },
			)
			.exec()
	}

	async renameCard(renameCardInput: RenameCardInput): Promise<Board> {
		return await this.model
			.findOneAndUpdate(
				{
					_id: renameCardInput.boardId,
					'lists._id': renameCardInput.listId,
				},
				{
					$set: {
						'lists.$.cards.$[card].name': renameCardInput.name,
					},
				},
				{
					new: true,
					upsert: true,
					arrayFilters: [
						{
							'card._id': renameCardInput.cardId,
						},
					],
				},
			)
			.exec()
	}

	async changeCardDescription(changeCardDescription: ChangeCardDescriptionInput): Promise<Board> {
		return await this.model
			.findOneAndUpdate(
				{
					_id: changeCardDescription.boardId,
					'lists._id': changeCardDescription.listId,
				},
				{
					$set: {
						'lists.$.cards.$[card].description': changeCardDescription.description,
					},
				},
				{
					new: true,
					upsert: true,
					arrayFilters: [
						{
							'card._id': changeCardDescription.cardId,
						},
					],
				},
			)
			.exec()
	}

	async deleteCard(deleteCardInput: DeleteCardInput): Promise<Board> {
		return await this.model
			.findOneAndUpdate(
				{
					_id: deleteCardInput.boardId,
				},
				{
					$pull: {
						'lists.$[list].cards': { _id: deleteCardInput.cardId },
					},
				},
				{
					new: true,
					upsert: true,
					arrayFilters: [
						{
							'list._id': deleteCardInput.listId,
						},
					],
				},
			)
			.exec()
	}

	//Card labels
	async addLabelToCard(
		addLabelToCardInput: AddLabelToCardInput,
	): Promise<Board> {
		console.log(addLabelToCardInput)

		return await this.model
			.findOneAndUpdate(
				{
					_id: addLabelToCardInput.boardId,
					'lists._id': addLabelToCardInput.listId,
				},
				{
					$push: {
						'lists.$.cards.$[card].labels': new Types.ObjectId(
							addLabelToCardInput.labelId,
						),
					},
				},
				{
					new: true,
					upsert: true,
					arrayFilters: [
						{
							'card._id': addLabelToCardInput.cardId,
						},
					],
				},
			)
			.exec()
	}

	async deleteLabelFromCard(
		deleteLabelFromCardInput: DeleteLabelFromCardInput,
	): Promise<Board> {
		return await this.model
			.findByIdAndUpdate(
				deleteLabelFromCardInput.boardId,
				{
					$pull: {
						'lists.$[list].cards.$[card].labels':
							deleteLabelFromCardInput.labelId,
					},
				},
				{
					new: true,
					upsert: true,
					arrayFilters: [
						{
							'list._id': deleteLabelFromCardInput.listId,
						},
						{
							'card._id': deleteLabelFromCardInput.cardId,
						},
					],
				},
			)
			.exec()
	}

	//Users
	async addMemberToBoard(
		addMemberToBoardInput: AddMemberToBoardInput,
	): Promise<Board> {
		return await this.model
			.findByIdAndUpdate(
				addMemberToBoardInput.boardId,
				{
					$push: {
						members: {
							userId: new Types.ObjectId(addMemberToBoardInput.userId),
						},
					},
				},
				{
					new: true,
					upsert: true,
				},
			)
			.exec()
	}

	async deleteMemberFromBoard(
		deleteMemberFromBoardInput: DeleteMemberFromBoardInput,
	): Promise<Board> {
		return await this.model
			.findByIdAndUpdate(
				deleteMemberFromBoardInput.boardId,
				{
					$pull: {
						members: {
							_id: new Types.ObjectId(deleteMemberFromBoardInput.memberId),
						},
					},
				},
				{
					new: true,
					upsert: true,
				},
			)
			.exec()
	}
}

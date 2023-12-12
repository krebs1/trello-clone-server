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
import { ChangeCardDateInput } from './dto/change-card-date.input'
import { ChangeDefaultRoleInput } from './dto/change-default-role.input'
import { v4 as uuidv4 } from 'uuid'
import { Member } from './models/member.model'

@Injectable()
export class BoardService {
	constructor(
		@InjectModel(Board.name) private readonly model: Model<BoardDocument>,
	) {}

	//Board
	async aggregateBoardById(_id: string): Promise<Board> {
		const [board, err] = await this.model
			.aggregate([
				{ $match: { $expr: { $eq: ['$_id', new Types.ObjectId(_id)] } } },
				{
					$lookup: {
						from: 'backgrounds',
						localField: 'background',
						foreignField: '_id',
						as: 'backgroundInfo',
					},
				},
				{ $unwind: { path: '$members', preserveNullAndEmptyArrays: true } },
				{
					$lookup: {
						from: 'users',
						localField: 'members.userId',
						foreignField: '_id',
						as: 'members.userInfo',
					},
				},
				{ $unwind: { path: '$labels', preserveNullAndEmptyArrays: true } },
				{
					$lookup: {
						from: 'colors',
						localField: 'labels.colorId',
						foreignField: '_id',
						as: 'labels.colorInfo',
					},
				},
				{
					$unwind: {
						path: '$labels.colorInfo',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$unwind: {
						path: '$members.userInfo',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$unwind: {
						path: '$backgroundInfo',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$group: {
						_id: '$_id',
						name: {
							$last: '$name',
						},
						background: {
							$last: '$background',
						},
						backgroundInfo: {
							$last: '$backgroundInfo',
						},
						members: {
							$addToSet: '$members',
						},
						lists: {
							$last: '$lists',
						},
						labels: {
							$addToSet: '$labels',
						},
						inviteLink: {
							$last: '$inviteLink',
						},
						defaultRole: {
							$last: '$defaultRole',
						},
					},
				},
				{
					$project: {
						_id: 1,
						name: 1,
						background: 1,
						backgroundInfo: 1,
						members: {
							$sortArray: {
								input: '$members',
								sortBy: { _id: 1 },
							},
						},
						lists: {
							$sortArray: {
								input: '$lists',
								sortBy: { _id: 1 },
							},
						},
						labels: {
							$sortArray: {
								input: '$labels',
								sortBy: { _id: 1 },
							},
						},
						inviteLink: 1,
						defaultRole: 1,
					},
				},
			])
			.exec()

		//@ts-ignore
		if (Object.keys(board.labels[0]) == 0) board.labels = []
		return board
	}

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

	async aggregateBoardByUserId(_id: string): Promise<Board[]> {
		const boards = await this.model
			.aggregate([
				{
					$match: {
						members: { $elemMatch: { userId: new Types.ObjectId(_id) } },
					},
				},
				{
					$lookup: {
						from: 'backgrounds',
						localField: 'background',
						foreignField: '_id',
						as: 'backgroundInfo',
					},
				},
				{ $unwind: { path: '$members', preserveNullAndEmptyArrays: true } },
				{
					$lookup: {
						from: 'users',
						localField: 'members.userId',
						foreignField: '_id',
						as: 'members.userInfo',
					},
				},
				{ $unwind: { path: '$labels', preserveNullAndEmptyArrays: true } },
				{
					$lookup: {
						from: 'colors',
						localField: 'labels.colorId',
						foreignField: '_id',
						as: 'labels.colorInfo',
					},
				},
				{
					$unwind: {
						path: '$labels.colorInfo',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$unwind: {
						path: '$members.userInfo',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$unwind: {
						path: '$backgroundInfo',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$group: {
						_id: '$_id',
						name: {
							$last: '$name',
						},
						background: {
							$last: '$background',
						},
						backgroundInfo: {
							$last: '$backgroundInfo',
						},
						members: {
							$addToSet: '$members',
						},
						lists: {
							$last: '$lists',
						},
						labels: {
							$addToSet: '$labels',
						},
						inviteLink: {
							$last: '$inviteLink',
						},
						defaultRole: {
							$last: '$defaultRole',
						},
					},
				},
				{
					$project: {
						_id: 1,
						name: 1,
						background: 1,
						backgroundInfo: 1,
						members: {
							$sortArray: {
								input: '$members',
								sortBy: { _id: 1 },
							},
						},
						lists: {
							$sortArray: {
								input: '$lists',
								sortBy: { _id: 1 },
							},
						},
						labels: {
							$sortArray: {
								input: '$labels',
								sortBy: { _id: 1 },
							},
						},
						inviteLink: 1,
						defaultRole: 1,
					},
				},
			])
			.sort('_id')
			.exec()

		const boardsRes = boards.map(board => {
			// @ts-ignore
			if (Object.keys(board.labels[0]) == 0) board.labels = []
			return board
		})

		return boardsRes
	}

	async createBoard(createBoardInput: CreateBoardInput): Promise<Board> {
		return await this.model.create({
			name: createBoardInput.name,
			members: {
				userId: new Types.ObjectId(createBoardInput.userId),
				role: new Types.ObjectId('655cd1c9dc7883f2632ccbcf'),
			},
			background: new Types.ObjectId(createBoardInput.backgroundId),
			defaultRole: new Types.ObjectId('655ccee0dc7883f2632ccbce'),
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

	//Invite
	async createInviteLink(_id: string): Promise<Board> {
		const link = uuidv4()

		return await this.model
			.findByIdAndUpdate(_id, { inviteLink: link }, { new: true })
			.exec()
	}

	async deleteInviteLink(_id: string): Promise<Board> {
		return await this.model
			.findByIdAndUpdate(_id, { inviteLink: null }, { new: true })
			.exec()
	}

	async changeDefaultRole(input: ChangeDefaultRoleInput): Promise<Board> {
		return await this.model
			.findByIdAndUpdate(
				input.boardId,
				{ defaultRole: new Types.ObjectId(input.roleId) },
				{ new: true },
			)
			.exec()
	}

	//Board labels
	async createLabel(createLabelInput: CreateLabelInput): Promise<Board> {
		await this.model
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
		return this.aggregateBoardById(createLabelInput.boardId)
	}

	async editLabel(editLabelInput: EditLabelInput): Promise<Board> {
		await this.model
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
		return this.aggregateBoardById(editLabelInput.boardId)
	}

	async deleteLabel(deleteLabelInput: DeleteLabelInput): Promise<Board> {
		await this.model
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
		return this.aggregateBoardById(deleteLabelInput.boardId)
	}

	//Lists
	async createList(createListInput: CreateListInput): Promise<Board> {
		await this.model
			.findByIdAndUpdate(
				createListInput.boardId,
				{ $push: { lists: { name: createListInput.name } } },
				{ new: true },
			)
			.exec()
		return this.aggregateBoardById(createListInput.boardId)
	}

	async renameList(renameListInput: RenameListInput): Promise<Board> {
		await this.model
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
		return this.aggregateBoardById(renameListInput.boardId)
	}

	async deleteList(deleteListInput: DeleteListInput): Promise<Board> {
		await this.model
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
		return this.aggregateBoardById(deleteListInput.boardId)
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

		await this.model
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
		return this.aggregateBoardById(changeCardOrderInput.boardId)
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

		await this.model
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
		return this.aggregateBoardById(moveCardInput.boardId)
	}

	async createCard(createCardInput: CreateCardInput): Promise<Board> {
		await this.model
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
		return this.aggregateBoardById(createCardInput.boardId)
	}

	async renameCard(renameCardInput: RenameCardInput): Promise<Board> {
		await this.model
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
		return this.aggregateBoardById(renameCardInput.boardId)
	}

	async changeCardDescription(
		changeCardDescription: ChangeCardDescriptionInput,
	): Promise<Board> {
		await this.model
			.findOneAndUpdate(
				{
					_id: changeCardDescription.boardId,
					'lists._id': changeCardDescription.listId,
				},
				{
					$set: {
						'lists.$.cards.$[card].description':
							changeCardDescription.description,
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
		return this.aggregateBoardById(changeCardDescription.boardId)
	}

	async changeCardDate(
		changeCardDateInput: ChangeCardDateInput,
	): Promise<Board> {
		await this.model
			.findOneAndUpdate(
				{
					_id: changeCardDateInput.boardId,
					'lists._id': changeCardDateInput.listId,
				},
				{
					$set: {
						'lists.$.cards.$[card].startDate': changeCardDateInput.startDate,
						'lists.$.cards.$[card].dueDate': changeCardDateInput.dueDate,
					},
				},
				{
					new: true,
					upsert: true,
					arrayFilters: [
						{
							'card._id': changeCardDateInput.cardId,
						},
					],
				},
			)
			.exec()
		return this.aggregateBoardById(changeCardDateInput.boardId)
	}

	async deleteCard(deleteCardInput: DeleteCardInput): Promise<Board> {
		await this.model
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
		return this.aggregateBoardById(deleteCardInput.boardId)
	}

	//Card labels
	async addLabelToCard(
		addLabelToCardInput: AddLabelToCardInput,
	): Promise<Board> {
		await this.model
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
		return this.aggregateBoardById(addLabelToCardInput.boardId)
	}

	async deleteLabelFromCard(
		deleteLabelFromCardInput: DeleteLabelFromCardInput,
	): Promise<Board> {
		await this.model
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
		return this.aggregateBoardById(deleteLabelFromCardInput.boardId)
	}

	//Users
	async addMemberToBoard(
		addMemberToBoardInput: AddMemberToBoardInput,
	): Promise<Board> {
		await this.model
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
		return this.aggregateBoardById(addMemberToBoardInput.boardId)
	}

	async deleteMemberFromBoard(
		deleteMemberFromBoardInput: DeleteMemberFromBoardInput,
	): Promise<Board> {
		await this.model
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
		return this.aggregateBoardById(deleteMemberFromBoardInput.boardId)
	}

	async getMemberByUserId(
		boardId: string,
		userId: string,
	): Promise<Member | null> {
		const board = await this.model
			.findOne({
				_id: boardId,
				'members.userId': new Types.ObjectId(userId),
			})
			.exec()
		if (!board) return null

		const member = board
			.toObject()
			.members.filter(member => member.userId.toString() === userId)[0]

		return member
	}

	async checkUserHasAccess(
		boardId: string,
		userId: Types.ObjectId,
	): Promise<boolean> {
		const board = await this.model
			.findOne({
				_id: boardId,
				'members.userId': userId,
			})
			.exec()
		return !!board
	}
}

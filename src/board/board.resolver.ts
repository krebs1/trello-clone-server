import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { BoardService } from './board.service'
import { Board } from './models/board.model'
import { CreateBoardInput } from './dto/create-board.input'
import { RenameBoardInput } from './dto/rename-board.input'
import { CreateListInput } from './dto/create-list.input'
import { RenameListInput } from './dto/rename-list.input'
import { DeleteListInput } from './dto/delete-list.input'
import { CreateCardInput } from './dto/create-card.input'
import { RenameCardInput } from './dto/rename-card.input'
import { DeleteCardInput } from './dto/delete-card.input'
import { CreateLabelInput } from './dto/create-label.input'
import { EditLabelInput } from './dto/edit-label.input'
import { DeleteLabelInput } from './dto/delete-label.input'
import { AddLabelToCardInput } from './dto/add-label-to-card.input'
import { DeleteLabelFromCardInput } from './dto/delete-label-from-card.input'
import { AddMemberToBoardInput } from './dto/add-member-to-board.input'
import { DeleteMemberFromBoardInput } from './dto/delete-member-from-board.input'
import { SetMetadata, UseGuards } from '@nestjs/common'
import { GqlGuard } from '../guards/gqlGuard'
import { PubSub } from 'graphql-subscriptions'
import { ChangeCardOrderInput } from './dto/change-card-order.input'
import { MoveCardInput } from './dto/move-card.input'
import { ChangeCardDescriptionInput } from './dto/change-card-description.input'
import { ChangeCardDateInput } from './dto/change-card-date.input'
import { ChangeDefaultRoleInput } from './dto/change-default-role.input'
import { HasAccessGuard } from '../guards/hasAccessGuard'
import { RoleGuard } from '../guards/roleGuard'
import * as process from 'process'

const pubSub = new PubSub()

@Resolver(() => Board)
export class BoardResolver {
	constructor(private readonly boardService: BoardService) {}

	//Subscription
	@Subscription(() => Board, {
		filter: (payload, variables) => {
			return payload.boardModified._id.toString() === variables.boardId
		},
	})
	boardModified(@Args('boardId') boardId: string) {
		return pubSub.asyncIterator('boardModified')
	}

	//Board
	@UseGuards(GqlGuard)
	@Query(() => [Board])
	findAllBoards() {
		return this.boardService.findAllBoards()
	}

	//@UseGuards(GqlGuard)
	@UseGuards(HasAccessGuard)
	@Query(() => Board)
	findBoardById(@Args('_id', { type: () => String }) _id: string) {
		return this.boardService.findBoardById(_id)
	}

	@Query(() => Board)
	aggregateBoardById(@Args('_id', { type: () => String }) _id: string) {
		return this.boardService.aggregateBoardById(_id)
	}

	@Query(() => [Board])
	findBoardsByName(@Args('name', { type: () => String }) name: string) {
		return this.boardService.findBoardsByName(name)
	}

	@UseGuards(GqlGuard)
	@Query(() => [Board])
	findBoardByUserId(@Args('_id', { type: () => String }) _id: string) {
		return this.boardService.findBoardByUserId(_id)
	}

	@Query(() => [Board])
	aggregateBoardByUserId(@Args('_id', { type: () => String }) _id: string) {
		return this.boardService.aggregateBoardByUserId(_id)
	}

	@UseGuards(GqlGuard)
	@Mutation(() => Board)
	createBoard(
		@Args('createBoardInput', { type: () => CreateBoardInput })
		createBoardInput: CreateBoardInput,
	) {
		createBoardInput = {
			name: createBoardInput.name,
			userId: createBoardInput.userId,
			backgroundId: createBoardInput.backgroundId,
		}

		return this.boardService.createBoard(createBoardInput)
	}

	@SetMetadata('roles', ['ADMIN'])
	@UseGuards(GqlGuard, HasAccessGuard, RoleGuard)
	@Mutation(() => Board)
	async renameBoard(
		@Args('boardId', { type: () => String })
		boardId: string,
		@Args('renameBoardInput', { type: () => RenameBoardInput })
		renameBoardInput: RenameBoardInput,
	) {
		renameBoardInput = {
			_id: renameBoardInput._id,
			name: renameBoardInput.name,
		}
		const modifiedBoard = await this.boardService.renameBoard(renameBoardInput)
		await pubSub.publish('boardModified', { boardModified: modifiedBoard })
		return modifiedBoard
	}

	@Mutation(() => Board)
	deleteBoard(@Args('_id', { type: () => String }) _id: string) {
		return this.boardService.deleteBoard(_id)
	}

	//Invite
	@Mutation(() => Board)
	async createInviteLink(
		@Args('_id', { type: () => String })
		_id: string,
	) {
		const modifiedBoard = await this.boardService.createInviteLink(_id)
		await pubSub.publish('boardModified', { boardModified: modifiedBoard })
		return modifiedBoard
	}

	@Mutation(() => Board)
	async deleteInviteLink(
		@Args('_id', { type: () => String })
		_id: string,
	) {
		const modifiedBoard = await this.boardService.deleteInviteLink(_id)
		await pubSub.publish('boardModified', { boardModified: modifiedBoard })
		return modifiedBoard
	}

	@Mutation(() => Board)
	async changeDefaultRole(
		@Args('changeDefaultRoleInput', { type: () => ChangeDefaultRoleInput })
		input: ChangeDefaultRoleInput,
	) {
		input = {
			boardId: input.boardId,
			roleId: input.roleId,
		}
		const modifiedBoard = await this.boardService.changeDefaultRole(input)
		await pubSub.publish('boardModified', { boardModified: modifiedBoard })
		return modifiedBoard
	}

	//Board labels
	@Mutation(() => Board)
	createLabel(
		@Args('createLabelInput', { type: () => CreateLabelInput })
		createLabelInput: CreateLabelInput,
	) {
		return this.boardService.createLabel(createLabelInput)
	}

	@Mutation(() => Board)
	editLabel(
		@Args('editLabelInput', { type: () => EditLabelInput })
		editLabelInput: EditLabelInput,
	) {
		return this.boardService.editLabel(editLabelInput)
	}

	@Mutation(() => Board)
	async deleteLabel(
		@Args('deleteLabelInput', { type: () => DeleteLabelInput })
		deleteLabelInput: DeleteLabelInput,
	) {
		const modifiedBoard = await this.boardService.deleteLabel(deleteLabelInput)
		await pubSub.publish('boardModified', { boardModified: modifiedBoard })
		return modifiedBoard
	}

	//List
	@Mutation(() => Board)
	async createList(
		@Args('createListInput', { type: () => CreateListInput })
		createListInput: CreateListInput,
	) {
		createListInput = {
			boardId: createListInput.boardId,
			name: createListInput.name,
		}
		const modifiedBoard = await this.boardService.createList(createListInput)
		await pubSub.publish('boardModified', { boardModified: modifiedBoard })
		return modifiedBoard
	}

	@Mutation(() => Board)
	async renameList(
		@Args('renameListInput', { type: () => RenameListInput })
		renameListInput: RenameListInput,
	) {
		renameListInput = {
			boardId: renameListInput.boardId,
			listId: renameListInput.listId,
			name: renameListInput.name,
		}
		const modifiedBoard = await this.boardService.renameList(renameListInput)
		await pubSub.publish('boardModified', { boardModified: modifiedBoard })
		return modifiedBoard
	}

	@Mutation(() => Board)
	deleteList(
		@Args('deleteListInput', { type: () => DeleteListInput })
		deleteListInput: DeleteListInput,
	) {
		deleteListInput = {
			boardId: deleteListInput.boardId,
			listId: deleteListInput.listId,
		}
		return this.boardService.deleteList(deleteListInput)
	}

	//Card
	@Query(() => Board)
	findCardById(@Args('_id', { type: () => String }) _id: string) {
		return this.boardService.findCardById(_id)
	}

	@Mutation(() => Board)
	async changeCardOrder(
		@Args('changeCardOrderInput', { type: () => ChangeCardOrderInput })
		changeCardOrderInput: ChangeCardOrderInput,
	) {
		changeCardOrderInput = {
			boardId: changeCardOrderInput.boardId,
			listId: changeCardOrderInput.listId,
			firstIndex: changeCardOrderInput.firstIndex,
			secondIndex: changeCardOrderInput.secondIndex,
		}
		const modifiedBoard =
			await this.boardService.changeCardOrder(changeCardOrderInput)
		await pubSub.publish('boardModified', { boardModified: modifiedBoard })
		return modifiedBoard
	}

	@Mutation(() => Board)
	async moveCard(
		@Args('moveCardInput', { type: () => MoveCardInput })
		moveCardInput: MoveCardInput,
	) {
		moveCardInput = {
			boardId: moveCardInput.boardId,
			sourceListId: moveCardInput.sourceListId,
			sourceCardId: moveCardInput.sourceCardId,
			destinationListId: moveCardInput.destinationListId,
			destinationIndex: moveCardInput.destinationIndex,
		}
		const modifiedBoard = await this.boardService.moveCard(moveCardInput)
		await pubSub.publish('boardModified', { boardModified: modifiedBoard })
		return modifiedBoard
	}

	@Mutation(() => Board)
	async createCard(
		@Args('createCardInput', { type: () => CreateCardInput })
		createCardInput: CreateCardInput,
	) {
		createCardInput = {
			boardId: createCardInput.boardId,
			listId: createCardInput.listId,
			name: createCardInput.name,
		}
		const modifiedBoard = await this.boardService.createCard(createCardInput)
		await pubSub.publish('boardModified', { boardModified: modifiedBoard })
		return modifiedBoard
	}

	@Mutation(() => Board)
	async renameCard(
		@Args('renameCardInput', { type: () => RenameCardInput })
		renameCardInput: RenameCardInput,
	) {
		renameCardInput = {
			boardId: renameCardInput.boardId,
			listId: renameCardInput.listId,
			cardId: renameCardInput.cardId,
			name: renameCardInput.name,
		}
		const modifiedBoard = await this.boardService.renameCard(renameCardInput)
		console.log(modifiedBoard)
		await pubSub.publish('boardModified', { boardModified: modifiedBoard })
		return modifiedBoard
	}

	@Mutation(() => Board)
	async changeCardDescription(
		@Args('changeCardDescriptionInput', {
			type: () => ChangeCardDescriptionInput,
		})
		changeCardDescriptionInput: ChangeCardDescriptionInput,
	) {
		changeCardDescriptionInput = {
			boardId: changeCardDescriptionInput.boardId,
			listId: changeCardDescriptionInput.listId,
			cardId: changeCardDescriptionInput.cardId,
			description: changeCardDescriptionInput.description,
		}
		const modifiedBoard = await this.boardService.changeCardDescription(
			changeCardDescriptionInput,
		)
		console.log(modifiedBoard)
		await pubSub.publish('boardModified', { boardModified: modifiedBoard })
		return modifiedBoard
	}

	@Mutation(() => Board)
	async changeCardDate(
		@Args('changeCardDateInput', {
			type: () => ChangeCardDateInput,
		})
		changeCardDateInput: ChangeCardDateInput,
	) {
		changeCardDateInput = {
			boardId: changeCardDateInput.boardId,
			listId: changeCardDateInput.listId,
			cardId: changeCardDateInput.cardId,
			startDate: changeCardDateInput.startDate,
			dueDate: changeCardDateInput.dueDate,
		}
		const modifiedBoard =
			await this.boardService.changeCardDate(changeCardDateInput)
		await pubSub.publish('boardModified', { boardModified: modifiedBoard })
		return modifiedBoard
	}

	@Mutation(() => Board)
	deleteCard(
		@Args('deleteCardInput', { type: () => DeleteCardInput })
		deleteCardInput: DeleteCardInput,
	) {
		deleteCardInput = {
			boardId: deleteCardInput.boardId,
			listId: deleteCardInput.listId,
			cardId: deleteCardInput.cardId,
		}
		return this.boardService.deleteCard(deleteCardInput)
	}

	//Card labels
	@Mutation(() => Board)
	async addLabelToCard(
		@Args('addLabelToCardInput', { type: () => AddLabelToCardInput })
		addLabelToCardInput: AddLabelToCardInput,
	) {
		addLabelToCardInput = {
			boardId: addLabelToCardInput.boardId,
			listId: addLabelToCardInput.listId,
			cardId: addLabelToCardInput.cardId,
			labelId: addLabelToCardInput.labelId,
		}
		const modifiedBoard =
			await this.boardService.addLabelToCard(addLabelToCardInput)
		await pubSub.publish('boardModified', { boardModified: modifiedBoard })
		return modifiedBoard
	}

	@Mutation(() => Board)
	async deleteLabelFromCard(
		@Args('deleteLabelFromCardInput', { type: () => DeleteLabelFromCardInput })
		deleteLabelFromCardInput: DeleteLabelFromCardInput,
	) {
		deleteLabelFromCardInput = {
			boardId: deleteLabelFromCardInput.boardId,
			listId: deleteLabelFromCardInput.listId,
			cardId: deleteLabelFromCardInput.cardId,
			labelId: deleteLabelFromCardInput.labelId,
		}
		const modifiedBoard = await this.boardService.deleteLabelFromCard(
			deleteLabelFromCardInput,
		)
		await pubSub.publish('boardModified', { boardModified: modifiedBoard })
		return modifiedBoard
	}

	//Users
	@Mutation(() => Board)
	addMemberToBoard(
		@Args('addMemberToBoardInput', { type: () => AddMemberToBoardInput })
		addMemberToBoardInput: AddMemberToBoardInput,
	) {
		addMemberToBoardInput = {
			boardId: addMemberToBoardInput.boardId,
			userId: addMemberToBoardInput.userId,
		}
		return this.boardService.addMemberToBoard(addMemberToBoardInput)
	}

	@Mutation(() => Board)
	deleteMemberFromBoard(
		@Args('deleteMemberFromBoardInput', {
			type: () => DeleteMemberFromBoardInput,
		})
		deleteMemberFromBoardInput: DeleteMemberFromBoardInput,
	) {
		deleteMemberFromBoardInput = {
			boardId: deleteMemberFromBoardInput.boardId,
			memberId: deleteMemberFromBoardInput.memberId,
		}
		return this.boardService.deleteMemberFromBoard(deleteMemberFromBoardInput)
	}
}

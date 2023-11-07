import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteMemberFromBoardInput {
	@Field({ description: 'Board id' })
	boardId: string

	@Field({ description: 'Member id' })
	memberId: string
}

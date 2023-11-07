import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class AddMemberToBoardInput {
	@Field({ description: 'Board id' })
	boardId: string

	@Field({ description: 'User id' })
	userId: string
}

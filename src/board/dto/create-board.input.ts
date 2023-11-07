import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateBoardInput {
	@Field({ description: 'Board name' })
	name: string

	@Field({ description: 'User id' })
	userId: string
}

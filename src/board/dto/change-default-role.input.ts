import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ChangeDefaultRoleInput {
	@Field({ description: 'Board id' })
	boardId: string

	@Field({ description: 'Role id' })
	roleId: string
}
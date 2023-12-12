import { Args, Query, Resolver } from '@nestjs/graphql'
import { RoleService } from './role.service'
import { Role } from './models/role.model'

@Resolver()
export class RoleResolver {
	constructor(private readonly roleService: RoleService) {
	}

	@Query(() => [Role])
	findAllRoles() {
		return this.roleService.getAllRoles()
	}

	@Query(() => Role)
	findRoleById(@Args('_id', { type: () => String }) _id: string) {
		return this.roleService.getRoleById(_id)
	}
}

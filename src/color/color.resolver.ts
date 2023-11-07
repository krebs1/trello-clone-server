import { Args, Query, Resolver } from '@nestjs/graphql'
import { ColorService } from './color.service'
import { Color } from './schemas/color.model'

@Resolver()
export class ColorResolver {
	constructor(private readonly colorService: ColorService) {}

	@Query(() => [Color])
	findAllColors() {
		return this.colorService.findAllColors()
	}

	@Query(() => Color)
	findColorById(@Args('_id', { type: () => String }) _id: string) {
		return this.colorService.findColorById(_id)
	}
}

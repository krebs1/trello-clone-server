import { Args, Query, Resolver } from '@nestjs/graphql'
import { BackgroundService } from './background.service'
import { Background } from './schemas/background.model'

@Resolver()
export class BackgroundResolver {
	constructor(private readonly backgroundService: BackgroundService) {}

	@Query(() => [Background])
	findAllBackgrounds() {
		return this.backgroundService.findAllBackgrounds()
	}

	@Query(() => [Background])
	findBackgroundById(@Args('_id', { type: () => String }) _id: string) {
		return this.backgroundService.findBackgroundById(_id)
	}
}

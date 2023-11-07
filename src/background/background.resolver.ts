import { Query, Resolver } from '@nestjs/graphql'
import { BackgroundService } from './background.service'
import { Background } from './schemas/background.model'

@Resolver()
export class BackgroundResolver {
	constructor(private readonly backgroundService: BackgroundService) {
	}

	@Query(()=>[Background])
	findAllBackgrounds(){
		return this.backgroundService.findAllBackgrounds();
	}
}

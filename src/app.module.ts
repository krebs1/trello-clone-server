import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule } from '@nestjs/config'
import { BoardModule } from './board/board.module'
import { ColorModule } from './color/color.module'
import { SessionModule } from './session/session.module'
import { BackgroundModule } from './background/background.module';
import * as process from 'process'
import { ServeStaticModule } from '@nestjs/serve-static'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.env`,
			isGlobal: true,
		}),
		MongooseModule.forRoot(process.env.MONGODB_URI, {
			autoIndex: true,
		}),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: join(process.cwd(), 'src/schemas.gql'),
			sortSchema: true,
			//cors: {origin: true, credentials: true},
			subscriptions: {
				'graphql-ws': true,
				'subscriptions-transport-ws': true,
			},
			context: ({ req, res }) => ({ req, res }),
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'public', 'backgrounds')
		}),
		BoardModule,
		ColorModule,
		SessionModule,
		BackgroundModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}

console.log(join(__dirname, '..', 'public', 'backgrounds'))
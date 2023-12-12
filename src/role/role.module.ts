import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';
import { MongooseModule } from '@nestjs/mongoose'
import { Role, RoleSchema } from './models/role.model'

@Module({
  providers: [RoleService, RoleResolver],
  imports: [
    MongooseModule.forFeature([{name: Role.name, schema: RoleSchema}])
  ]
})
export class RoleModule {}

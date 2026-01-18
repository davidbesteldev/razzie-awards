import { Injectable, OnModuleInit } from '@nestjs/common'

import { ImportCSVOnInitUseCase } from '@app/modules/movies/use-cases/import-csv-on-init.use-case'

@Injectable()
export class MovieService implements OnModuleInit {
  constructor(private readonly importCSVOnInitUseCase: ImportCSVOnInitUseCase) {}

  async onModuleInit() {
    await this.importCSVOnInitUseCase.execute()
  }
}

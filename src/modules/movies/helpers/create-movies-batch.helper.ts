import { Injectable } from '@nestjs/common'

import {
  Movie,
  MovieProducer,
  MovieStudio,
  Prisma,
  Producer,
  Studio,
} from '@generated/prisma/client'

import { deduplicateByKey } from '@app/common/utils'
import { DatabaseService } from '@app/core/database/database.service'
import { CreateMovieDTO } from '@app/modules/movies/dto/create-movie.dto'
import { buildMovieKey } from '@app/modules/movies/utils/movie-key.util'

/**
 * NOTE:
 * This helper performs explicit existence checks (findMany) before creating records
 * to avoid duplicates, since SQLite does not fully support `createMany({ skipDuplicates: true })`
 * in a reliable way for this use case.
 *
 * In a real-world production scenario using databases like PostgreSQL or MySQL,
 * this logic could be simplified and optimized by relying on unique constraints
 * combined with `createMany({ skipDuplicates: true })`, reducing round-trips
 * and improving overall performance.
 */

@Injectable()
export class CreateMoviesBatchHelper {
  constructor(private readonly database: DatabaseService) {}

  async execute(dtos: CreateMovieDTO[]) {
    const uniqueDtos = deduplicateByKey(dtos, (dto) => buildMovieKey(dto))

    const allProducerNames = [...new Set(uniqueDtos.flatMap((d) => d.producers))]
    const allStudioNames = [...new Set(uniqueDtos.flatMap((d) => d.studios))]

    await this.database.$transaction(async (tx) => {
      const { producers, studios } = await this.ensureProducersAndStudios(
        tx,
        allProducerNames,
        allStudioNames,
      )

      const movies = await this.createMovies(tx, uniqueDtos)

      await this.createMovieRelations(tx, movies, uniqueDtos, producers, studios)
    })
  }

  private async ensureProducersAndStudios(
    tx: Prisma.TransactionClient,
    producers: string[],
    studios: string[],
  ): Promise<{ producers: Producer[]; studios: Studio[] }> {
    const [existingProducers, existingStudios] = await Promise.all([
      tx.producer.findMany({ where: { name: { in: producers } } }),
      tx.studio.findMany({ where: { name: { in: studios } } }),
    ])

    const producersToCreate = producers
      .filter((name) => !existingProducers.some((p) => p.name === name))
      .map((name) => ({ name }))

    const studiosToCreate = studios
      .filter((name) => !existingStudios.some((s) => s.name === name))
      .map((name) => ({ name }))

    const createdProducers = producersToCreate.length
      ? await tx.producer.createManyAndReturn({ data: producersToCreate })
      : []

    const createdStudios = studiosToCreate.length
      ? await tx.studio.createManyAndReturn({ data: studiosToCreate })
      : []

    return {
      producers: [...existingProducers, ...createdProducers],
      studios: [...existingStudios, ...createdStudios],
    }
  }

  private async createMovies(
    tx: Prisma.TransactionClient,
    dtos: CreateMovieDTO[],
  ): Promise<Movie[]> {
    const whereClause = { OR: dtos.map((dto) => ({ title: dto.title, year: dto.year })) }

    const existingMovies = await tx.movie.findMany({
      where: whereClause,
      select: { id: true, title: true, year: true },
    })

    const moviesToCreate = dtos.filter(
      (dto) =>
        !existingMovies.some((movie) => buildMovieKey(movie) === buildMovieKey(dto)),
    )

    if (moviesToCreate.length) {
      await tx.movie.createMany({
        data: moviesToCreate.map((dto) => ({
          title: dto.title,
          year: dto.year,
          winner: dto.winner,
        })),
      })
    }

    return tx.movie.findMany({ where: whereClause })
  }

  private async createMovieRelations(
    tx: Prisma.TransactionClient,
    movies: Movie[],
    dtos: CreateMovieDTO[],
    producers: Producer[],
    studios: Studio[],
  ) {
    const movieIdMap = new Map(movies.map((m) => [buildMovieKey(m), m.id]))

    const movieProducersToCreate: MovieProducer[] = []
    const movieStudiosToCreate: MovieStudio[] = []

    const existingMovieProducers = await tx.movieProducer.findMany({
      select: { movieId: true, producerId: true },
    })

    const existingMovieStudios = await tx.movieStudio.findMany({
      select: { movieId: true, studioId: true },
    })

    for (const dto of dtos) {
      const movieId = movieIdMap.get(buildMovieKey(dto))
      if (!movieId) continue

      for (const producerName of dto.producers) {
        const producer = producers.find((p) => p.name === producerName)
        if (!producer) continue

        const alreadyExists = existingMovieProducers.some(
          (mp) => mp.movieId === movieId && mp.producerId === producer.id,
        )

        if (!alreadyExists) {
          movieProducersToCreate.push({ movieId, producerId: producer.id })
        }
      }

      for (const studioName of dto.studios) {
        const studio = studios.find((s) => s.name === studioName)
        if (!studio) continue

        const alreadyExists = existingMovieStudios.some(
          (ms) => ms.movieId === movieId && ms.studioId === studio.id,
        )

        if (!alreadyExists) {
          movieStudiosToCreate.push({ movieId, studioId: studio.id })
        }
      }
    }

    if (movieProducersToCreate.length) {
      await tx.movieProducer.createMany({ data: movieProducersToCreate })
    }

    if (movieStudiosToCreate.length) {
      await tx.movieStudio.createMany({ data: movieStudiosToCreate })
    }
  }
}

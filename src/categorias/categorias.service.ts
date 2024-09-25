import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Categoria } from './interfaces/categoria.interface';
import { InjectModel } from '@nestjs/mongoose';
import { CriarCategoriaDto } from './dtos/create-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
  ) {}

  async criarCategoria(
    criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    const { categoria } = criarCategoriaDto;
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (categoriaEncontrada) {
      throw new BadRequestException(`Categoria ${categoria} já cadastrada`);
    }

    try {
      const categoriaCriada = new this.categoriaModel(criarCategoriaDto);
      return await categoriaCriada.save();
    } catch (error) {
      throw new BadRequestException(
        `Erro ao criar categoria: ${error.message}`,
      );
    }
  }
}

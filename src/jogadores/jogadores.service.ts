import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CriarJogadorDto } from './dtos/create-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dtos/update-jogador.dto';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private readonly logger = new Logger(JogadoresService.name);

  async criarJogador(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criaJogadorDto;

    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      throw new BadRequestException(
        `Jogador com o email ${email} já cadastrado`,
      );
    }

    try {
      const jogadorCriado = new this.jogadorModel(criaJogadorDto);
      return await jogadorCriado.save();
    } catch (error) {
      this.logger.error(`Erro ao criar jogador: ${error.message}`, error.stack);
      throw new BadRequestException('Erro ao criar jogador');
    }
  }

  async atualizarJogador(
    _id: string,
    atualizarJogadorDto: AtualizarJogadorDto,
  ): Promise<void> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorEncontrado) {
      this.logger.warn(`Jogador com id: ${_id} não encontrado`);
      throw new NotFoundException(`Jogador com id: ${_id} não encontrado`);
    }

    try {
      await this.jogadorModel
        .findOneAndUpdate({ _id }, { $set: atualizarJogadorDto })
        .exec();
      this.logger.log(`Jogador com id: ${_id} atualizado com sucesso`);
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar jogador: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Erro ao atualizar jogador');
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    try {
      return await this.jogadorModel.find().exec();
    } catch (error) {
      this.logger.error(
        `Erro ao consultar jogadores: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Erro ao consultar jogadores');
    }
  }

  async consultarJogadorPeloId(_id: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorEncontrado) {
      this.logger.warn(`Jogador com id: ${_id} não encontrado`);
      throw new NotFoundException(`Jogador com id: ${_id} não encontrado`);
    }

    return jogadorEncontrado;
  }

  async deletarJogador(_id: string): Promise<void> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorEncontrado) {
      this.logger.warn(`Jogador com id: ${_id} não encontrado`);
      throw new NotFoundException(`Jogador com id: ${_id} não encontrado`);
    }

    try {
      await this.jogadorModel.deleteOne({ _id }).exec();
      this.logger.log(`Jogador com id: ${_id} deletado com sucesso`);
    } catch (error) {
      this.logger.error(
        `Erro ao deletar jogador: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Erro ao deletar jogador');
    }
  }
}

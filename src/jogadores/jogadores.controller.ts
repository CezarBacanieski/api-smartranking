import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CriarJogadorDto } from './dtos/create-jogador.dto';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresValidacaoParametrosPipe } from './pipes/jogadores-validation-params.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}
  @Post()
  @UsePipes(ValidationPipe)
  async criarAtualizarJogador(@Body() criaJogadorDto: CriarJogadorDto) {
    await this.jogadoresService.criarAtualizarJogador(criaJogadorDto);
  }

  @Get()
  async consultarJogadores(
    @Query('email', JogadoresValidacaoParametrosPipe) email: string,
  ): Promise<Jogador[] | Jogador> {
    if (email) {
      return await this.jogadoresService.consultarJogadoresPeloEmail(email);
    } else {
      return await this.jogadoresService.consultarTodosJogadores();
    }
  }

  @Delete()
  async deletarJogardor(
    @Query('email', JogadoresValidacaoParametrosPipe) email: string,
  ): Promise<void> {
    await this.jogadoresService.deletarJogador(email);
  }
}

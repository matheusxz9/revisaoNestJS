import { Injectable } from '@nestjs/common';

export type Papel = 'solicitante' | 'gestor' | 'auditor';

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  senhaHash: string;
  papel: Papel;
  ativo: boolean;
}

export type UsuarioAutenticado = Omit<Usuario, "senhaHash">

@Injectable()
export class UsuariosService {
  private readonly usuarios: Usuario[] = [
    {
      id: 1,
      nome: 'Ana Lima',
      email: 'ana@empresa.com',
      senhaHash: '$2b$12$DJnB5VtBCX4.W24cPqlQDuCvFTjcjaau6NMur0QBEj.oWzecCiz0m',
      papel: 'gestor',
      ativo: true,
    },
    {
      id: 2,
      nome: 'Bruno Silva',
      email: 'bruno@empresa.com',
      senhaHash: '$2b$12$DJnB5VtBCX4.W24cPqlQDuCvFTjcjaau6NMur0QBEj.oWzecCiz0m',
      papel: 'solicitante',
      ativo: true,
    },
  ];

  buscarPorEmail(email: string) {
    return this.usuarios.find(usuario => usuario.email === email);
  }
}

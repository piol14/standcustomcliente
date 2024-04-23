
// ataque-stand.model.ts

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    sort: Sort;
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
}

export interface IPage<T> {
    content: T[];
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: Sort;
    first: boolean;
    numberOfElements: number;
    empty: boolean;

    strSortField: string;
    strSortDirection: string;
    strFilter: string;
    strFilteredTitle: string;
    strFilteredMessage: string;
    nRecords: number;
}

export interface IEntity {
    id: number,
}

  // opinion.model.ts
  export interface IOpinion  extends IEntity {
    
    usuario: IUser;
    descripcion: string;
   
    stand: IStand;
  }
  export interface IOpinionPage extends IPage<IOpinion> {
}
  // partida.model.ts
  export interface IPartida extends IEntity{
   
    fecha: string;
    usuario: IUser | null;
  }
  export interface IPartidaPage extends IPage<IPartida> {
  }
  // stand.model.ts
  export interface IStand extends IEntity {
  
    usuario: IUser;
    nombre: string;
    imagen:string;
    descripcion: string;
    velocidad: string;
    alcance: string;
    poder: string;
    aguante: string;
    acierto: string;
    desarollo :string;
    categoria:ICategoria;
  }
  export interface IStandPage extends IPage<IStand> {
}
export type formOperation = 'EDIT' | 'NEW';
  export interface IUser extends IEntity {
   
    nombre: string;
    telefono: string;
    email: string;
    username: string;
    password: string;
    role: boolean;
    opiniones?:number;
    stands?:number;
    partidas?:number;
  }
  export interface IUserPage extends IPage<IUser> {
}
  // usuario-stand.model.ts
  export interface IDetallePartida extends IEntity {
   
    usuario: IUser;
    stand: IStand;
    partida: IPartida;
  }
  export interface IDetallePartidaPage extends IPage<IDetallePartida> {
}
export interface IToken {
  jti: string;
  iss: string;
  iat: number;
  exp: number;
  name: string;
}

export interface SessionEvent {
  type: string;
}

export interface ICategoria extends IEntity {
  nombre: string;
  stands?:number;
}

export interface ICategoriaPage extends IPage<ICategoria> {}

export interface IFavorito extends IEntity{
  usuario: IUser;
  stand: IStand;
}
export interface IFavoritoPage extends IPage<IFavorito> {}
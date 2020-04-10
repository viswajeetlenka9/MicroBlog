

export class User {
    constructor(
      public id?: number,
      public username?: string,
      public email?: string,
      public password?: string,
      public about_me?: string,
      public last_seen?: Date,
      public token?: string,
      public token_expiration?: Date,
      public _links? : {
        avatar : string,
        self : string,
        followed : string,
        followers : string
      }
    ) { }
  }


  export class Post {
    constructor(
      public id?: number,
      public body? : string,
      public timestamp?: Date,
      public user_id? : number,
      public language? : string,
      public author? : string,
    ){
      
    }
  }

  export class PostArray {
    constructor(
        public _links? : {
            next? : string,
            prev? : string,
            self? : string
          },
          public _meta? : {
            page? : number,
            per_page? : number,
            total_items? : number,
            total_pages? : number
          },
          public items? : Post[]
    ){
      
    }
  }
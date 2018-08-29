export class Post {
    constructor(
        public _id: string,
        public user: string,
        public text: string,
        public file: string,
        public created_at: string
    ) {}
}


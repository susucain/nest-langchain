import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
export declare class BookService {
    create(createBookDto: CreateBookDto): string;
    private readonly bookRepository;
    findAll(): any;
    findOne(id: number): string;
    update(id: number, updateBookDto: UpdateBookDto): string;
    remove(id: number): string;
}

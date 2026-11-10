// ============================================================
// Assignment 14 - TypeScript OOP: Simple Notes Management System
// ============================================================

// ================================
// Part A
// ================================

// ------------------------------------------------------------
// 1. Base Class - User
// ------------------------------------------------------------
class User {
  private static idCounter = 0;

  public readonly id: number;
  public name: string;
  protected email: string;
  private password: string;
  public phone: string;
  private _age!: number;

  public noteBooks: NoteBook[] = [];

  constructor(
    name: string,
    email: string,
    password: string,
    phone: string,
    age: number,
  ) {
    this.id = ++User.idCounter;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.age = age; 
  }

  get age(): number {
    return this._age;
  }

  set age(value: number) {
    if (value < 18 || value > 60) {
      throw new Error("Age must be between 18 and 60");
    }
    this._age = value;
  }

  public changePassword(oldPassword: string, newPassword: string): boolean {
    if (oldPassword !== this.password) {
      return false;
    }
    this.password = newPassword;
    return true;
  }

  public displayInfo(): void {
    console.log(
      `User Info -> id: ${this.id}, name: ${this.name}, email: ${this.email}, phone: ${this.phone}, age: ${this.age}`,
    );
  }

  // ---------------- Aggregation: User <>-- NoteBook ----------------
  public addNoteBook(noteBook: NoteBook): void {
    this.noteBooks.push(noteBook);
  }

  public removeNoteBook(name: string): void {
    this.noteBooks = this.noteBooks.filter((book) => book.getName() !== name);
  }

  public showNoteBooks(): void {
    console.log(
      `${this.name}'s notebooks:`,
      this.noteBooks.map((book) => book.getName()),
    );
  }
}

// ------------------------------------------------------------
// 2. Inheritance - Admin
// ------------------------------------------------------------
class Admin extends User {
  private role: string;

  constructor(
    name: string,
    email: string,
    password: string,
    phone: string,
    age: number,
    role: string = "admin",
  ) {
    super(name, email, password, phone, age);
    this.role = role;
  }

  public getRole(): string {
    return this.role;
  }

  public manageNotes(noteBook: NoteBook, noteTitle: string): void {
    console.log(
      `[${this.role}] ${this.name} is deleting "${noteTitle}" from "${noteBook.getName()}"`,
    );
    noteBook.removeNote(noteTitle);
  }
}

// ------------------------------------------------------------
// 3. Class - Note
//    6. Association - Note -> User (every note has an author)
// ------------------------------------------------------------
class Note {
  private static idCounter = 0;

  public readonly id: number;
  public title: string;
  public content: string;
  public author: User; // Association: the user who created the note

  constructor(title: string, content: string, author: User) {
    this.id = ++Note.idCounter;
    this.title = title;
    this.content = content;
    this.author = author;
  }

  public get userId(): number {
    return this.author.id;
  }

  public preview(length: number = 20): string {
    return this.content.length > length
      ? this.content.substring(0, length) + "..."
      : this.content;
  }
}

// ------------------------------------------------------------
// 4. Composition - NoteBook and Notes
//    The NoteBook creates its own notes, so notes cannot live without it.
// ------------------------------------------------------------
class NoteBook {
  private name: string;
  private notes: Note[] = [];

  constructor(name: string) {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }

  public addNote(title: string, content: string, author: User): Note {
    const note = new Note(title, content, author);
    this.notes.push(note);
    return note;
  }

  public removeNote(title: string): void {
    this.notes = this.notes.filter((note) => note.title !== title);
  }

  public showNotes(): void {
    console.log(`Notes in "${this.name}":`);
    if (this.notes.length === 0) {
      console.log("  (no notes)");
      return;
    }
    this.notes.forEach((note) =>
      console.log(
        `  #${note.id} ${note.title} - ${note.preview()} (by ${note.author.name})`,
      ),
    );
  }
}

// ------------------------------------------------------------
// 7. Generics - Storage<T>
// ------------------------------------------------------------
class Storage<T> {
  private items: T[] = [];

  public addItem(item: T): void {
    this.items.push(item);
  }

  public removeItem(item: T): void {
    this.items = this.items.filter((existing) => existing !== item);
  }

  public getAllItems(): T[] {
    return [...this.items];
  }
}

// ================================
// Demo / Test
// ================================

console.log("----- 1. User -----");
const user1 = new User("saad", "saad@gmail.com", "qwedf1545", "01012345678", 21);
user1.displayInfo();

try {
  new User("Kid", "kid@gmail.com", "123456", "01000000000", 10);
} catch (error) {
  console.log("Validation works ->", (error as Error).message);
}

console.log("\n----- 2. Admin (Inheritance) -----");
const admin1 = new Admin("Ahmed", "ahmed@gmail.com", "12bdikiffdn", "01015665554", 30);
admin1.displayInfo();

console.log("\n----- 3 & 4. Note + NoteBook (Composition) -----");
const studyBook = new NoteBook("Study");
studyBook.addNote("TypeScript", "Classes, inheritance, generics and more", user1);
studyBook.addNote("Shopping", "Milk and eggs", user1);
studyBook.showNotes();

console.log("\n----- 5. User + NoteBook (Aggregation) -----");
const workBook = new NoteBook("Work"); 
user1.addNoteBook(studyBook);
user1.addNoteBook(workBook);
user1.showNoteBooks();
user1.removeNoteBook("Work");
user1.showNoteBooks();

console.log("\n----- 6. Note + User (Association) -----");
const firstNote = studyBook.addNote("Idea", "Build a notes app", user1);
console.log(`Note "${firstNote.title}" was written by ${firstNote.author.name} (userId: ${firstNote.userId})`);

console.log("\n----- Admin manages notes -----");
admin1.manageNotes(studyBook, "Shopping");
studyBook.showNotes();

console.log("\n----- 7. Generics (Storage<T>) -----");
const numbers = new Storage<number>();
numbers.addItem(10);
numbers.addItem(20);
console.log("numbers:", numbers.getAllItems());
numbers.removeItem(10);
console.log("numbers after remove:", numbers.getAllItems());

const users = new Storage<User>();
users.addItem(user1);
users.addItem(admin1);
console.log("users:", users.getAllItems().map((u) => u.name));

export {};

// ================================
// Part B - Relationships
// ================================
/**
 * - Inheritance : Admin  --|> User
 * - Aggregation : User   <>-- NoteBook  (User owns notebooks, they are created outside)
 * - Composition : NoteBook <#>-- Note   (NoteBook creates and owns its notes)
 * - Association : Note   --> User       (author)
 */

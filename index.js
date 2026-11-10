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
    static idCounter = 0;
    id;
    name;
    email;
    password;
    phone;
    _age;
    noteBooks = [];
    constructor(name, email, password, phone, age) {
        this.id = ++User.idCounter;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.age = age;
    }
    get age() {
        return this._age;
    }
    set age(value) {
        if (value < 18 || value > 60) {
            throw new Error("Age must be between 18 and 60");
        }
        this._age = value;
    }
    changePassword(oldPassword, newPassword) {
        if (oldPassword !== this.password) {
            return false;
        }
        this.password = newPassword;
        return true;
    }
    displayInfo() {
        console.log(`User Info -> id: ${this.id}, name: ${this.name}, email: ${this.email}, phone: ${this.phone}, age: ${this.age}`);
    }
    // ---------------- Aggregation: User <>-- NoteBook ----------------
    addNoteBook(noteBook) {
        this.noteBooks.push(noteBook);
    }
    removeNoteBook(name) {
        this.noteBooks = this.noteBooks.filter((book) => book.getName() !== name);
    }
    showNoteBooks() {
        console.log(`${this.name}'s notebooks:`, this.noteBooks.map((book) => book.getName()));
    }
}
// ------------------------------------------------------------
// 2. Inheritance - Admin
// ------------------------------------------------------------
class Admin extends User {
    role;
    constructor(name, email, password, phone, age, role = "admin") {
        super(name, email, password, phone, age);
        this.role = role;
    }
    getRole() {
        return this.role;
    }
    manageNotes(noteBook, noteTitle) {
        console.log(`[${this.role}] ${this.name} is deleting "${noteTitle}" from "${noteBook.getName()}"`);
        noteBook.removeNote(noteTitle);
    }
}
// ------------------------------------------------------------
// 3. Class - Note
//    6. Association - Note -> User (every note has an author)
// ------------------------------------------------------------
class Note {
    static idCounter = 0;
    id;
    title;
    content;
    author; // Association: the user who created the note
    constructor(title, content, author) {
        this.id = ++Note.idCounter;
        this.title = title;
        this.content = content;
        this.author = author;
    }
    get userId() {
        return this.author.id;
    }
    preview(length = 20) {
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
    name;
    notes = [];
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    addNote(title, content, author) {
        const note = new Note(title, content, author);
        this.notes.push(note);
        return note;
    }
    removeNote(title) {
        this.notes = this.notes.filter((note) => note.title !== title);
    }
    showNotes() {
        console.log(`Notes in "${this.name}":`);
        if (this.notes.length === 0) {
            console.log("  (no notes)");
            return;
        }
        this.notes.forEach((note) => console.log(`  #${note.id} ${note.title} - ${note.preview()} (by ${note.author.name})`));
    }
}
// ------------------------------------------------------------
// 7. Generics - Storage<T>
// ------------------------------------------------------------
class Storage {
    items = [];
    addItem(item) {
        this.items.push(item);
    }
    removeItem(item) {
        this.items = this.items.filter((existing) => existing !== item);
    }
    getAllItems() {
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
}
catch (error) {
    console.log("Validation works ->", error.message);
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
const numbers = new Storage();
numbers.addItem(10);
numbers.addItem(20);
console.log("numbers:", numbers.getAllItems());
numbers.removeItem(10);
console.log("numbers after remove:", numbers.getAllItems());
const users = new Storage();
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

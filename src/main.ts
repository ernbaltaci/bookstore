import * as readline from 'readline';

interface Book {
  title: string;
  author: string;
  publishYear: number;
  stock: number;
}

interface Rental {
  userName: string;
  bookTitle: string;
  returnDate: Date;
}

const books: Book[] = [];
const rentals: Rental[] = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  while (true) {
    console.log('\nLibrary System');
    console.log('1. Add Book');
    console.log('2. Rent Book');
    console.log('3. Return Book');
    console.log('4. Search Book');
    console.log('5. Reporting');
    console.log('0. Exit');

    const choice = await prompt('Your choice: ');

    switch (choice) {
      case '1':
        await addBook();
        break;
      case '2':
        await rentBook();
        break;
      case '3':
        await returnBook();
        break;
      case '4':
        await searchBook();
        break;
      case '5':
        await reporting();
        break;
      case '0':
        console.log('Exiting the program...');
        rl.close();
        return;
      default:
        console.log('Invalid choice, please try again.');
        break;
    }
  }
}

async function addBook() {
  const title = await prompt('Book Title: ');
  const author = await prompt('Author Name: ');
  const publishYear = parseInt(await prompt('Publish Year: '), 10);
  const stock = parseInt(await prompt('Stock Quantity: '), 10);

  const existingBook = books.find(
    (b) => b.title === title && b.author === author
  );

  if (existingBook) {
    existingBook.stock += stock;
    console.log('The book already exists. Stock updated.');
  } else {
    books.push({ title, author, publishYear, stock });
    console.log('New book added.');
  }
}

async function rentBook() {
  console.log('Available Books:');
  books.forEach((book, index) =>
    console.log(
      `${index + 1}. ${book.title} - ${book.author} (Stock: ${book.stock})`
    )
  );

  const bookIndex =
    parseInt(await prompt('Select the book number to rent: '), 10) - 1;

  if (
    bookIndex < 0 ||
    bookIndex >= books.length ||
    books[bookIndex].stock === 0
  ) {
    console.log('Invalid selection or no stock available.');
    return;
  }

  const days = parseInt(await prompt('How many days to rent: '), 10);

  const totalCost = days * 5;

  const budget = parseInt(await prompt(`You need to pay ${totalCost} $`), 10);

  if (budget < totalCost) {
    console.log('Insufficient budget.');
    return;
  }

  const userName = await prompt('Your name: ');

  books[bookIndex].stock--;
  rentals.push({
    userName,
    bookTitle: books[bookIndex].title,
    returnDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
  });

  console.log(
    `Book rented successfully. Return date: ${new Date(
      Date.now() + days * 24 * 60 * 60 * 1000
    ).toLocaleDateString()}`
  );
}

async function returnBook() {
  const bookTitle = await prompt('Enter the title of the book to return: ');

  const rental = rentals.find((r) => r.bookTitle === bookTitle);
  if (!rental) {
    console.log('This book is not rented.');
    return;
  }

  const book = books.find((b) => b.title === bookTitle);
  if (book) {
    book.stock++;
  }

  rentals.splice(rentals.indexOf(rental), 1);
  console.log('Book returned successfully.');
}

async function searchBook() {
  console.log('1. Search by book title');
  console.log('2. Search by author name');

  const choice = await prompt('Your choice: ');
  const term = await prompt('Search term: ');

  let results: Book[] = [];
  if (choice === '1') {
    results = books.filter((b) =>
      b.title.toLowerCase().includes(term.toLowerCase())
    );
  } else if (choice === '2') {
    results = books.filter((b) =>
      b.author.toLowerCase().includes(term.toLowerCase())
    );
  }

  if (results.length === 0) {
    console.log('No matching books found.');
  } else {
    results.forEach((book) =>
      console.log(
        `${book.title} - ${book.author} (${book.publishYear}) [Stock: ${book.stock}]`
      )
    );
  }
}

async function reporting() {
  console.log('1. List all books');
  console.log('2. List books by a specific author');
  console.log('3. List books by a specific publish year');
  console.log('4. List rented books');

  const choice = await prompt('Your choice: ');

  if (choice === '1') {
    books.forEach((book) =>
      console.log(
        `${book.title} - ${book.author} (${book.publishYear}) [Stock: ${book.stock}]`
      )
    );
  } else if (choice === '2') {
    const author = await prompt('Author name: ');
    const authorBooks = books.filter((b) =>
      b.author.toLowerCase().includes(author.toLowerCase())
    );
    authorBooks.forEach((book) =>
      console.log(
        `${book.title} - ${book.author} (${book.publishYear}) [Stock: ${book.stock}]`
      )
    );
  } else if (choice === '3') {
    const year = parseInt(await prompt('Publish year: '), 10);
    const yearBooks = books.filter((b) => b.publishYear === year);
    yearBooks.forEach((book) =>
      console.log(
        `${book.title} - ${book.author} (${book.publishYear}) [Stock: ${book.stock}]`
      )
    );
  } else if (choice === '4') {
    rentals.forEach((rental) =>
      console.log(
        `${rental.bookTitle} - ${
          rental.userName
        } (Return Date: ${rental.returnDate.toLocaleDateString()})`
      )
    );
  } else {
    console.log('Invalid choice.');
  }
}

main().catch((error) => {
  console.error(error);
  rl.close();
});


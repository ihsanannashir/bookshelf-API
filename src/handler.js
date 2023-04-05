const { nanoid } = require('nanoid');
const books = require('./books');

//API dapat menyimpan buku
const addBookHandler = (request, h) => {
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;

	const id = nanoid(16);
    const finished = readPage === pageCount ? true : false;
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;

	if (!name) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Mohon isi nama buku',
		});
		response.code(400);
		return response;
	} else if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
		});
		response.code(400);
		return response;
	}

	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		insertedAt,
		updatedAt,
	};

	books.push(newBook);

	const isSuccess = books.filter((book) => book.id === id).length > 0;

	if (isSuccess) {
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil ditambahkan',
			data: {
				bookId: id,
			},
		});
		response.code(201);
		return response;
	}

	const response = h.response({
		status: 'fail',
		message: 'Buku gagal ditambahkan',
	});
	response.code(500);
};

//API dapat menampilkan seluruh buku
const getAllBookHandler = (request, h) => {
	let {name, reading, finished } = request.query;

	let getByName = [];
	let getByReading = [];
	let getByFinished = [];
	let getBooks = [];

	//Nama berdasarkan value query
	if (typeof name === 'string') {
		if (name !== undefined) {
			books.forEach((book) => {
				let bookName = book.name.toLowerCase();
				name = name.toLowerCase();

				if (bookName.includes(name)) {
					getByName.push({
						id: book.id,
						name: book.name,
						publisher: book.publisher,
					});
				}
			});
		}

		const response = h.response({
			status: 'success',
			data: {
				books: getByName,
			},
		});
		response.code(200);
		return response;
	}

	//Buku sedang dibaca/tidak dibaca
	if (reading === '0') {
		getByReading = [];

		books.forEach((book) => {
			if (!book.reading) {
				getByReading.push({
					id: book.id,
					name: book.name,
					publisher: book.publisher,
				});
			}
		});

		const response = h.response({
			status: 'success',
			data: {
				books: getByReading,
			},
		});
		response.code(200);
		return response;
	} else if (reading === '1') {
		getByReading = [];

		books.forEach((book) => {
			if (book.reading) {
				getByReading.push({
					id: book.id,
					name: book.name,
					publisher: book.publisher,
				});
			}
		});

		const response = h.response({
			status: 'success',
			data: {
				books: getByReading,
			},
		});
		response.code(200);
		return response;
	}

	//Buku sudah/belum selesai dibaca
	if (finished === '0') {
		getByFinished = [];

		books.forEach((book) => {
			if (!book.finished) {
				getByFinished.push({
					id: book.id,
					name: book.name,
					publisher: book.publisher,
				});
			}
		});

		const response = h.response({
			status: 'success',
			data: {
				books: getByFinished,
			},
		});
		response.code(200);
		return response;
	} else if (finished === '1') {
		getByFinished = [];

		books.forEach((book) => {
			if (book.finished) {
				getByFinished.push({
					id: book.id,
					name: book.name,
					publisher: book.publisher,
				});
			}
		});

		const response = h.response({
			status: 'success',
			data: {
				books: getByFinished,
			},
		});
		response.code(200);
		return response;
	}

	if (books.length > 0) {
		books.forEach((book) => {
			getBooks.push({
				id: book.id,
				name: book.name,
				publisher: book.publisher,
			});
		});
        
		const response = h.response({
			status: 'success',
			data: {
				books: getBooks,
			},
		});
		response.code(200);
		return response;
	}

	const response = h.response({
		status: 'success',
		data: {
			books: [],
		},
	});
	return response;
};

//API dapat menampilkan detail buku
const getBookByIdHandler = (request, h) => {
	const { bookId } = request.params;
	const book = books.filter((book) => book.id === bookId)[0];

	if (book !== undefined) {
		const response = h.response({
			status: 'success',
			data: {
				book: book,
			},
		});
		response.code(200);
		return response;
	}

	const response = h.response({
		status: 'fail',
		message: 'Buku tidak ditemukan',
	});
	response.code(404);
	return response;
};

//API dapat mengubah data buku
const editBookByIdHandler = (request, h) => {
	const { bookId } = request.params;
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;
	const updatedAt = new Date().toISOString();

	const index = books.findIndex((book) => book.id === bookId);

	if (index !== -1) {
		if (!name) {
			const response = h.response({
				status: 'fail',
				message: 'Gagal memperbarui buku. Mohon isi nama buku',
			});
			response.code(400);
			return response;
		} else if (readPage > pageCount) {
			const response = h.response({
				status: 'fail',
				message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
			});
			response.code(400);
			return response;
		} else {
			books[index] = {
				...books[index],
				name,
				year,
				author,
				summary,
				publisher,
				pageCount,
				readPage,
				reading,
				updatedAt,
			};
			const response = h.response({
				status: 'success',
				message: 'Buku berhasil diperbarui',
			});
			response.code(200);
			return response;
		}
	}

	const response = h.response({
		status: 'fail',
		message: 'Gagal memperbarui buku. Id tidak ditemukan',
	});
	response.code(404);
	return response;
};

//API dapat menghapus buku
const deleteBookByIdHandler = (request, h) => {
	const { bookId } = request.params;

	const index = books.findIndex((book) => book.id === bookId);

	if (index !== -1) {
		books.splice(index, 1);
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil dihapus',
		});
		response.code(200);
		return response;
	}

	const response = h.response({
		status: 'fail',
		message: 'Buku gagal dihapus. Id tidak ditemukan',
	});
	response.code(404);
	return response;
};

module.exports = { getAllBookHandler, addBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };
// Request to localhost, port 9669, is listened by Sign Tool
const server_url = 'ws://localhost:9669';

export type TSignData = {
	status: string;
	data?: any;
	message?: string;
	socket?: WebSocket;
};

export const sign_service = {
	sign_hash: function (sha256_content: string, callback: (val: TSignData) => void) {
		if ('WebSocket' in window) {
			const socket = new WebSocket(server_url);
			socket.onopen = function () {
				socket.send(
					JSON.stringify({
						request: 'sign_hash',
						alg_hash: 'SHA256',
						hash_content: sha256_content,
					}),
				);
			};
			socket.onclose = function () {
				console.log('connection closed');
			};
			socket.onmessage = function (response) {
				socket.close();
				if (callback && response.data) callback(JSON.parse(response.data)); //data = message_to_front
			};
		} else {
			if (callback) callback({ message: 'Trình duyệt không hỗ trợ websocket', status: 'error' });
		}
	},
	verify_sign_hash: function (
		sha256_content: string,
		signature: string,
		public_key: string,
		callback: (val: TSignData) => void,
	) {
		if ('WebSocket' in window) {
			const socket = new WebSocket(server_url);
			socket.onopen = function () {
				socket.send(
					JSON.stringify({
						request: 'verify_sign_hash',
						alg_hash: 'SHA256',
						signature: signature,
						hash_content: sha256_content,
						public_key: public_key,
					}),
				);
			};
			socket.onclose = function () {
				console.log('connection closed');
			};
			socket.onmessage = function (response) {
				socket.close();
				if (callback && response.data) callback(JSON.parse(response.data)); //data = message_to_front
			};
		} else {
			if (callback) callback({ message: 'Trình duyệt không hỗ trợ websocket', status: 'error' });
		}
	},

	//Chuẩn bị ký theo lô (Sẽ hiển thị Form cho người dùng chọn chữ ký)
	init_sign_batch: function (sign_batch_total: number, callback: (val: TSignData) => void) {
		if ('WebSocket' in window) {
			const socket = new WebSocket(server_url);
			socket.onopen = function () {
				socket.send(
					JSON.stringify({
						request: 'sign_batch',
						total: sign_batch_total,
					}),
				);
			};
			socket.onclose = function () {
				console.log('connection closed');
			};
			socket.onerror = function () {
				if (callback)
					callback({ message: 'Kết nối không thành công. Vui lòng kiểm tra lại tool Ký số', status: 'error' });
			};
			socket.onmessage = function (response) {
				if (callback && response.data) {
					const data = JSON.parse(response.data);
					if (data.status == 'ready' || data.status == 'not_ready') callback({ data, socket, status: data.status });
				}
			};
		} else {
			if (callback) callback({ message: 'Trình duyệt không hỗ trợ websocket', status: 'error' });
		}
	},

	//Ký 1 tài liệu theo lô
	sign_batch_next: function (id: string, json_object: object, socket: WebSocket, callback: (data: object) => void) {
		socket.onmessage = function (response) {
			if (callback && response.data) {
				const data = JSON.parse(response.data);
				callback(data);
			}
		};
		socket.send(
			JSON.stringify({
				id: id,
				data: json_object,
			}),
		);
	},

	sign_batch_finish: function (socket: WebSocket) {
		if (socket !== null) socket.close();
		else console.log('socket null');
	},

	sign_batch_stop: function (socket: WebSocket) {
		if (socket !== null) {
			if (socket.readyState == 1) {
				socket.send(
					JSON.stringify({
						disconnect: true,
					}),
				);

				socket.close();
			}
		} else console.log('socket null');
	},
};

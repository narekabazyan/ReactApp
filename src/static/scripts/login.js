$(document).ready(function() {
	var loginForm = $('#login-form');
	var endpoint = 'http://localhost:3000/api/token';
	var error = $(loginForm).find('.error');

	loginForm.submit(function(e) {
		e.preventDefault();
		var username = $('#username-input').val();
		var password = $('#password-input').val();

		$.ajax({
			url: endpoint,
			method: 'POST',
			dataType: 'json',
			data: {
				grant_type: 'password',
				username: username,
				password: password
			},
			success: function(data) {
				$(error).hide();
				localStorage.setItem('accessToken', data.accessToken);
				window.location = '/';
			},
			error: function() {
				$(error).show();
			}
		});
	});
});
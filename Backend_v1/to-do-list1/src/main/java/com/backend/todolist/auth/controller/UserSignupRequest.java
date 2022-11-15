package com.backend.todolist.auth.controller;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import javax.validation.constraints.Email;



public class UserSignupRequest {
	@NotEmpty(message = "User email is required")
	@Email(regexp = "[a-z0-9]+@[a-z]+\\.[a-z]{2,3}")

    private String username;
    
    @NotEmpty(message = "Password is required")
    @Size(min=8, message = "Password length should be 8 characters or more")
    private String password;
    
    protected UserSignupRequest() {
    	
    }

	public UserSignupRequest(String username, String password) {
		super();
		this.username = username;
		this.password = password;
	}

	public String getUsername() {
		return username;
	}

	public String getPassword() {
		return password;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setPassword(String password) {
		this.password = password;
	}
    
    
}

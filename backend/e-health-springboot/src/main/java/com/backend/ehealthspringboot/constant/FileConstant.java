package com.backend.ehealthspringboot.constant;

public class FileConstant {
	public static final String USER_IMAGE_PATH = "/api/users/doctors/image";
	public static final String DEFAULT_USER_IMAGE_PATH = "/api/users/doctors/image/default";
	public static final String TEMP_PROFILE_IMAGE_BASE_URL = System.getProperty("user.home") + "/OneDrive/Desktop/PFE/e-health-app-angular-spring-boot/img/default";
	public static final String USER_FOLDER = System.getProperty("user.home") + "/OneDrive/Desktop/PFE/e-health-app-angular-spring-boot/img";
	public static final String JPG_EXTENSION = "jpg";
	public static final String DOT = ".";
	public static final String FORWARD_SLASH = "/";
	public static final String FILE_SAVED_IN_FILE_SYSTEM = "Saved file in file system by name: ";
	public static final String DIRECTORY_CREATED = "Created directory for: ";
	public static final String NOT_AN_IMAGE_FILE = " is not an image file. Please upload an image file";
}


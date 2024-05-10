package com.dance101.steptodance.global.utils;

import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class FileUtil {

	public static MultipartFile convertToMultipartFile(File file) throws IOException {
		Path path = Paths.get(file.getAbsolutePath());
		String name = file.getName();
		String originalFilename = file.getName();
		String contentType = Files.probeContentType(path);
		byte[] content = Files.readAllBytes(path);
		return new MultipartFile() {
			@Override
			public String getName() {
				return name;
			}

			@Override
			public String getOriginalFilename() {
				return originalFilename;
			}

			@Override
			public String getContentType() {
				return contentType;
			}

			@Override
			public boolean isEmpty() {
				return content.length == 0;
			}

			@Override
			public long getSize() {
				return content.length;
			}

			@Override
			public byte[] getBytes() throws IOException {
				return content;
			}

			@Override
			public InputStream getInputStream() throws IOException {
				return new ByteArrayInputStream(content);
			}

			@Override
			public void transferTo(File dest) throws IOException, IllegalStateException {
				Files.write(dest.toPath(), content);
			}
		};
	}
}

package com.dance101.steptodance.global.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.ReadConcern;
import com.mongodb.WriteConcern;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

@Configuration
public class MongoConfig {
	@Value("${spring.data.mongodb.uri}")
	private String uri;
	@Value("${spring.data.mongodb.database}")
	private String database;

	@Bean
	public MongoClient mongoClient() {
		return MongoClients.create(createMongoClientSettings());
	}

	@Bean
	public MongoTemplate mongoTemplate() {
		return new MongoTemplate(mongoClient(), database);
	}

	private MongoClientSettings createMongoClientSettings() {
		ConnectionString connectionString = new ConnectionString(uri);
		return MongoClientSettings.builder()
			.readConcern(ReadConcern.DEFAULT)
			.writeConcern(WriteConcern.MAJORITY)
			.applyConnectionString(connectionString)
			.build();
	}
}

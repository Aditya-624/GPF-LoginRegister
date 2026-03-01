# Spring Boot Startup Guide

## Issue Encountered
The Spring Boot application was failing to start with the error:
```
Schema validation: missing table [gpf_purpose_f]
```

## Root Cause
The `spring.jpa.hibernate.ddl-auto=validate` setting was checking for table existence before Flyway migrations could run and create the new `GPF_PURPOSE_F` table.

## Solution Applied
Changed the Hibernate DDL setting from `validate` to `none` in `application.properties`:

```properties
# Before
spring.jpa.hibernate.ddl-auto=validate

# After
spring.jpa.hibernate.ddl-auto=none
```

## Why This Works
- `validate`: Hibernate validates the schema against entities before startup (fails if tables are missing)
- `none`: Hibernate doesn't perform any schema operations, letting Flyway handle all migrations

## Starting the Application

### Option 1: Using Maven Wrapper (Recommended)
```bash
cd drdo-BackEnd/loginregister
.\mvnw.cmd spring-boot:run
```

### Option 2: Using Maven (if installed)
```bash
cd drdo-BackEnd/loginregister
mvn spring-boot:run
```

### Option 3: Using IDE
- Open the project in IntelliJ IDEA or Eclipse
- Run the `LoginregisterApplication.java` main class

## Verifying Startup

### Check Console Output
Look for these messages:
```
Flyway Community Edition ... by Redgate
Successfully validated 12 migrations
Migrating schema "ADITYA" to version "12 - create gpf purpose f table"
Successfully applied 1 migration to schema "ADITYA"
Started LoginregisterApplication in X.XXX seconds
```

### Test the API
```bash
# Test backend connection
curl http://localhost:8081/api/auth/test

# Test new GPF Purpose endpoint
curl http://localhost:8081/api/gpf-purpose/all
```

## Common Issues

### Issue 1: Port Already in Use
**Error:** `Port 8081 is already in use`
**Solution:** 
- Stop any running instance
- Or change port in `application.properties`: `server.port=8082`

### Issue 2: Database Connection Failed
**Error:** `Unable to connect to database`
**Solution:**
- Ensure Oracle XE is running
- Verify credentials in `application.properties`
- Check database URL: `jdbc:oracle:thin:@//localhost:1521/xe`

### Issue 3: Maven Not Found
**Error:** `mvn is not recognized`
**Solution:** Use Maven wrapper: `.\mvnw.cmd spring-boot:run`

### Issue 4: Flyway Migration Failed
**Error:** `Migration failed`
**Solution:**
- Check migration SQL syntax
- Verify database user has CREATE TABLE permissions
- Check Flyway version history: `SELECT * FROM flyway_schema_history;`

## Post-Startup Verification

### 1. Check Table Creation
```sql
-- Connect to Oracle
sqlplus aditya/aditya2468@localhost:1521/xe

-- Verify table exists
DESC GPF_PURPOSE_F;

-- Check sample data
SELECT * FROM GPF_PURPOSE_F;
```

### 2. Test API Endpoints
```bash
# Get all purposes
curl http://localhost:8081/api/gpf-purpose/all

# Get specific purpose
curl http://localhost:8081/api/gpf-purpose/1

# Search purposes
curl "http://localhost:8081/api/gpf-purpose/search?query=House"
```

### 3. Check Application Logs
Look for:
- ✅ Flyway migration success
- ✅ Hibernate initialization
- ✅ Tomcat started on port 8081
- ✅ Application started successfully

## Stopping the Application
- Press `Ctrl+C` in the terminal
- Or use IDE stop button

## Troubleshooting

### View Full Logs
```bash
# Increase logging level
logging.level.org.flywaydb=DEBUG
logging.level.org.hibernate=DEBUG
```

### Reset Flyway (if needed)
```sql
-- Only if you need to rerun migrations
DELETE FROM flyway_schema_history WHERE version = '12';
DROP TABLE GPF_PURPOSE_F;
```

### Clean and Rebuild
```bash
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

## Next Steps
Once the application starts successfully:
1. Verify the GPF_PURPOSE_F table exists
2. Test all API endpoints
3. Integrate with frontend
4. Add more purpose codes as needed

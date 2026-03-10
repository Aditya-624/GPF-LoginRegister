# Database Setup Guide for New PC

This guide will help you set up the Oracle database and create all required tables on a new PC.

## Prerequisites
1. Oracle Database installed and running
2. Oracle user created (e.g., `aditya` with password `aditya2468`)
3. Java and Maven installed
4. Project cloned to the new PC

## Option 1: Automatic Setup (Using Flyway - Recommended)

### Step 1: Update application.properties
Edit `drdo-BackEnd/loginregister/src/main/resources/application.properties`:

```properties
# Update these with your Oracle credentials
spring.datasource.url=jdbc:oracle:thin:@//localhost:1521/xe
spring.datasource.username=YOUR_ORACLE_USERNAME
spring.datasource.password=YOUR_ORACLE_PASSWORD

# Flyway should be enabled
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
```

### Step 2: Run Spring Boot Application
When you start the Spring Boot application for the first time, Flyway will automatically:
- Create the `flyway_schema_history` table
- Run all migration scripts in order
- Create all required tables

```bash
cd drdo-BackEnd/loginregister
mvn spring-boot:run
```

### Step 3: Verify Tables Created
Check in SQL Developer or SQLPlus:
```sql
SELECT table_name FROM user_tables ORDER BY table_name;
```

You should see:
- USERS
- GPF
- GPF_YEARS
- GPF_PURPOSE_F
- GPF_PURPOSE_E
- GPF_USR_DETAILS
- FLYWAY_SCHEMA_HISTORY

---

## Option 2: Manual Setup (If Flyway Fails)

If Flyway doesn't work, use the manual SQL script provided in `CREATE_ALL_TABLES_ORACLE.sql`.

### Step 1: Run the SQL Script
1. Open SQL Developer or SQLPlus
2. Connect to your Oracle database
3. Run the script: `CREATE_ALL_TABLES_ORACLE.sql`
4. Commit the changes

### Step 2: Disable Flyway (Optional)
If you created tables manually, you can disable Flyway:

```properties
spring.flyway.enabled=false
```

---

## Common Issues and Solutions

### Issue 1: Flyway Validation Error
**Error:** "Validate failed: Migrations have failed validation"

**Solution:**
```sql
-- Drop the flyway history table and let it recreate
DROP TABLE flyway_schema_history;
```
Then restart the Spring Boot application.

### Issue 2: Tables Already Exist
**Error:** "ORA-00955: name is already used by an existing object"

**Solution:**
```sql
-- Drop all tables (BE CAREFUL - This deletes all data!)
DROP TABLE GPF_USR_DETAILS CASCADE CONSTRAINTS;
DROP TABLE GPF_YEARS CASCADE CONSTRAINTS;
DROP TABLE GPF CASCADE CONSTRAINTS;
DROP TABLE GPF_PURPOSE_E CASCADE CONSTRAINTS;
DROP TABLE GPF_PURPOSE_F CASCADE CONSTRAINTS;
DROP TABLE USERS CASCADE CONSTRAINTS;
DROP SEQUENCE user_sequence;
```
Then run the setup again.

### Issue 3: Connection Refused
**Error:** "Connection refused" or "Cannot connect to database"

**Solution:**
1. Check Oracle is running: `lsnrctl status`
2. Verify connection details in `application.properties`
3. Test connection in SQL Developer first

---

## Insert Test Data

After tables are created, insert test data using the script in `ORACLE_TEST_DATA_INSERT.sql`.

---

## Verification Checklist

- [ ] Oracle Database is running
- [ ] User credentials are correct in application.properties
- [ ] All tables are created (7 tables total)
- [ ] Spring Boot application starts without errors
- [ ] Test data is inserted
- [ ] Can login with test credentials (WS001 / Test@123)

---

## Need Help?

If you encounter issues:
1. Check Spring Boot console logs for detailed error messages
2. Check Oracle alert log: `$ORACLE_HOME/diag/rdbms/xe/xe/trace/alert_xe.log`
3. Verify Flyway migration history: `SELECT * FROM flyway_schema_history;`

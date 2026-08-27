
import psycopg2

connections = psycopg2.connect(
    host="localhost",
    database="login_db",
    user="postgres",
    password="psgadmin",
    port=5432
)
print("postgresSQL connection successful!")
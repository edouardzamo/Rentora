# # reset_users.py
# from backend.create_tables import get_db
# from backend.postgres.models.user import User

# db = next(get_db())
# # # Delete all users
# db.query(User).delete()
# db.commit()
# print("All users deleted. Please register again.")
from app.models.category import Category


def create_category(db, category_data):
    category = Category(
        name=category_data.name,
        description=category_data.description
    )

    db.add(category)
    db.commit()
    db.refresh(category)

    return category


def get_all_categories(db):
    return db.query(Category).all()
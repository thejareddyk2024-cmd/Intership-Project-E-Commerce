from app.models.review import Review


def create_review(
    db,
    user_id: int,
    review_data
):
    review = Review(
        rating=review_data.rating,
        comment=review_data.comment,
        user_id=user_id,
        product_id=review_data.product_id
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    return review


def get_product_reviews(
    db,
    product_id: int
):
    return (
        db.query(Review)
        .filter(
            Review.product_id == product_id
        )
        .all()
    )
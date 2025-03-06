from sklearn.metrics.pairwise import cosine_similarity

def compute_cosine_similarity(tfidf_matrix):
    """Computes the cosine similarity matrix from the TF-IDF matrix."""
    return cosine_similarity(tfidf_matrix)

def get_top_n_similar_places(similarity_matrix, place_index, top_n=10):
    """Gets the top N most similar places to the given place index."""
    scores = list(enumerate(similarity_matrix[place_index]))
    sorted_scores = sorted(scores, key=lambda x: x[1], reverse=True)
    return [idx for idx, _ in sorted_scores[1:top_n+1]]
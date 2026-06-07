# RAG

![instructor_a46l9irobhg0f5webscixp0bs_public_1748542230_07_-_002_-_Text_Chunking_Strategies_05.1748542229862.jpg](RAG/instructor_a46l9irobhg0f5webscixp0bs_public_1748542230_07_-_002_-_Text_Chunking_Strategies_05.1748542229862.jpg)

## Here are the key takeaways from the **Text Chunking Strategies** lesson:

**Why chunking matters:** Chunking is a critical step in RAG pipelines — poor chunking leads to irrelevant context being retrieved, which causes your AI to produce wrong answers.

**The four main strategies:**

- **Size-based chunking** — Split text into equal-length character chunks. Simple and works with any document type, but can cut words mid-sentence and lose context. Adding *overlap* between chunks helps mitigate this.
- **Structure-based chunking** — Split on natural document structure (headers, paragraphs, sections). Produces the cleanest, most meaningful chunks, but only works when documents have reliable formatting (e.g., Markdown).
- **Semantic-based chunking** — Groups sentences by meaning/relatedness using NLP. Most accurate, but also the most computationally expensive and complex to implement.
- **Sentence-based chunking** — Splits on sentence boundaries, then groups sentences with optional overlap. A practical middle ground for most plain-text documents.

**How to choose:**

- Use **structure-based** when you control document formatting.
- Use **sentence-based** as a solid general-purpose option.
- Use **size-based** as a reliable fallback that works with any content type, including code — it's often the go-to choice in production for its simplicity and consistency.

**Bottom line:** There's no universal "best" strategy — the right choice depends on your documents, use case, and how much complexity you're willing to accept.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748542211_07_-_003_-_Text_Embeddings_03.1748542211434.jpg](RAG/instructor_a46l9irobhg0f5webscixp0bs_public_1748542211_07_-_003_-_Text_Embeddings_03.1748542211434.jpg)

## Here are the key takeaways from the **Text Embeddings** lesson:

**What are Text Embeddings?**
Text embeddings convert text into a list of numbers (each between -1 and +1) that represent the *meaning* of the text in a format computers can process mathematically.

**Why They Matter for RAG**
In a RAG pipeline, after chunking a document, you need to find which chunks are most relevant to a user's query. Semantic search — powered by embeddings — solves this by understanding meaning and context, unlike keyword search which only looks for exact word matches.

**How They Work**
You feed text into an embedding model, and it outputs a long numerical vector. Each number scores some "quality" of the text, but the exact meaning of each dimension is learned during training and isn't directly human-interpretable.

**VoyageAI is the Recommended Provider**
Since Anthropic doesn't offer its own embedding model, the course recommends **VoyageAI**. You set it up by creating an account, getting an API key, and using the `voyageai` Python library with a simple `client.embed()` call.

**What's Next**
The embeddings themselves are just numbers — the next step is learning how to *compare* them (e.g., via cosine similarity) to identify which chunks are most similar to a user's question, which is the core of semantic search.

## Here are the key takeaways from the "Implementing the RAG Flow" lesson:

**RAG follows five core steps:** chunk the text, generate embeddings for each chunk, store them in a vector database, generate an embedding for the user's query, and search the store for the most relevant chunks.

**Always store the original text alongside embeddings.** Embeddings are just numbers — when you retrieve results, you need the actual text content, not just the vectors. Each entry in the vector database should include both.

**Batch embedding is more efficient.** The embedding function can handle both single strings and lists, so you can generate all chunk embeddings in one pass rather than one at a time.

**Similarity is measured by distance.** The search returns cosine distances — lower values mean higher relevance. For example, a distance of 0.71 is a closer match than 0.72.

**RAG at its core is a math problem:** convert text to numbers, store them efficiently, and use mathematical similarity to find relevant content at query time.

**The basic implementation has limitations.** There are scenarios where it doesn't perform as expected, and further improvements are needed to make it more robust and accurate.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748542271_07_-_005_-_Implementing_the_Rag_Flow_10.1748542271657.jpg](RAG/instructor_a46l9irobhg0f5webscixp0bs_public_1748542271_07_-_005_-_Implementing_the_Rag_Flow_10.1748542271657.jpg)

## The key takeaway is that **semantic search alone isn't always enough** in RAG pipelines.

 While it's great at understanding meaning and context, it can miss exact term matches — especially for specific identifiers like incident IDs or technical terms.

The solution is **hybrid search**: combining semantic search (embedding-based) with **BM25 lexical search** (exact term matching) in parallel, then merging the results. BM25 works by giving higher importance to rare, specific terms and lower weight to common words, so it reliably surfaces documents containing the exact terms you're looking for.

Together, the two approaches are complementary — semantic search handles conceptual queries, and BM25 ensures precise matches aren't missed.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748542341_07_-_006_-_BM25_Lexical_Search_05.1748542341261.jpg](RAG/instructor_a46l9irobhg0f5webscixp0bs_public_1748542341_07_-_006_-_BM25_Lexical_Search_05.1748542341261.jpg)

The key takeaway from this lesson is: **combining semantic search (vector embeddings) and lexical search (BM25) into a hybrid retriever produces better results than either approach alone.**

Here's the core idea in a nutshell:

The lesson builds a `Retriever` class that queries both a `VectorIndex` and a `BM25Index` simultaneously, then merges their results using **Reciprocal Rank Fusion (RRF)**. RRF normalizes rankings across the two systems by scoring each document based on its rank in each index (using the formula `1 / (k + rank)`), so documents that rank well in *both* systems bubble to the top.

The practical payoff is demonstrated with a concrete example — a query that returned mediocre results from vector search alone returned significantly more relevant results from the hybrid retriever.

The secondary insight is about **architecture**: by giving `VectorIndex` and `BM25Index` identical APIs (`add_document()` and `search()`), the `Retriever` can wrap any number of search implementations without tight coupling. This makes the system easy to extend — you could add a graph-based index or domain-specific index just by implementing the same interface.

![instructor_a46l9irobhg0f5webscixp0bs_public_1748542335_07_-_007_-_A_Multi-Index_Rag_Pipeline_00.1748542335419.jpg](RAG/instructor_a46l9irobhg0f5webscixp0bs_public_1748542335_07_-_007_-_A_Multi-Index_Rag_Pipeline_00.1748542335419.jpg)
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)
CREATE TABLE IF NOT EXISTS authors (
    author_id INTEGER PRIMARY KEY AUTOINCREMENT,
    blogmaintitle VARCHAR(250),
    blogsubtitle VARCHAR(250),
    author_username VARCHAR(250)    
);

CREATE TABLE IF NOT EXISTS articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_title TEXT NOT NULL,
    article_subtitle TEXT NOT NULL,
    article_paragraph TEXT NOT NULL,
    author_id INTEGER,
    author_username VARCHAR(250),
    publication_date DATETIME DEFAULT NULL,
    published BOOLEAN DEFAULT 0,
    liked INTEGER DEFAULT 0 NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES authors(author_id)
);

DROP TRIGGER IF EXISTS updateArticles;

CREATE TABLE IF NOT EXISTS comments (
    comments_id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_text VARCHAR(250),
    author_id INTEGER,
    article_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(article_id),
    FOREIGN KEY (author_id) REFERENCES authors(author_id)
);

INSERT INTO authors (blogmaintitle, blogsubtitle, author_username)
VALUES
    ('Tech Tips', 'Insights into the world of technology', 'tech_guru'),
    ('Matos Blog (⸝⸝ᵕᴗᵕ⸝⸝)', 'Welcome to Matos blog', 'Haijimato Ryo'),
    ('Foodie Chronicles', 'Exploring the world of culinary delights', 'foodlover123');


INSERT INTO articles (article_title, article_subtitle, article_paragraph, author_id, publication_date, published, liked)
VALUES
    ('Getting Started with AI', 'A beginners guide to artificial intelligence', 'Artificial Intelligence (AI) has become an integral part of our lives...', 1, NULL,0,0),
    ('10 Must-Visit Destinations', 'A bucket list for every travel enthusiast', 'Are you a travel enthusiast looking for your next adventure?...', 2, NULL,0,0),
    ('Delicious Desserts from Around the World', 'Satisfy your sweet tooth with these delightful desserts', 'Discovering new and exotic desserts from different cultures...', 3, CURRENT_TIMESTAMP,1,0),
    ('The Future of Robotics', 'Exploring the potential of robotics in our future', 'As technology advances, robotics is playing a crucial role...', 1, CURRENT_TIMESTAMP,0,0),
    ('Hidden Gems of Europe', 'Uncovering the lesser-known wonders of Europe', 'Europe is filled with famous landmarks, but there are many hidden gems...', 2, NULL,0,0),
    ('Universal Studio Osaka', 'Best Theme Park in Osaka', 'Universal Studio Osaka, also known as Universal Studios Japan (USJ), is undoubtedly one of the best theme parks in Osaka, Japan. This iconic amusement park offers an unparalleled experience for visitors of all ages, bringing the magic of movies and thrilling attractions to life. As you step into Universal Studio Osaka, you will find yourself immersed in a world of fantasy and adventure. The park is divided into various themed areas, each representing famous movies and TV shows from Universal Pictures.

One of the highlights of Universal Studio Osaka is "The Wizarding World of Harry Potter." As you walk through the streets of Hogsmeade, you will marvel at the intricately designed buildings, unique shops, and magical landmarks like Hogwarts Castle. Do not miss the chance to take a thrilling ride on the "Harry Potter and the Forbidden Journey" attraction, where you will soar over Hogwarts and encounter magical creatures. For adrenaline junkies, Jurassic Park ,The Ride promises an unforgettable adventure. Prepare to encounter lifelike dinosaurs as you embark on a river raft journey through the prehistoric world.

If you are a fan of action-packed movies, you will love the Transformers: The Ride 3D. This cutting-edge attraction uses 3D technology and motion simulators to put you right in the middle of the battle between Autobots and Decepticons.

But Universal Studio Osaka is not just about thrills; it is also a haven for those seeking family-friendly entertainment. Kids will adore "Despicable Me Minion Mayhem" and "Sesame Street 4-D Movie Magic," where beloved characters come to life on the big screen.

When hunger strikes, the park offers a variety of dining options, including themed restaurants that transport you to different movie worlds.

Universal Studio Osaka is a year-round destination, but visiting during special events and seasonal celebrations adds even more magic to your experience. From Halloween Horror Nights to Christmas-themed celebrations, the park always has something new and exciting to offer.

Whether you are a movie buff, an adventure seeker, or simply looking to create unforgettable memories with your family, Universal Studio Osaka is the ultimate destination for fun, excitement, and endless entertainment. Get ready to experience the magic and wonder of the movies like never before at this extraordinary theme park in Osaka.', 2, CURRENT_TIMESTAMP,1,50),
    ('Osaka Namba Parks', 'Top 10 shopping malls to visit in Osaka', 'Namba Parks is a must-visit shopping mall in Osaka, Japan, known for its unique lifestyle experience. It goes beyond conventional shopping centers, offering a fusion of community, entertainment, health, beauty, knowledge, and healing with our needs in food, clothing, and shelter. The mall aims to achieve a Next-Generation Metropolis from Namba.

Namba Parks features diverse retail offerings, trendy fashion stores, household essentials, and delightful culinary delights. Its stunning architectural design includes lush rooftop gardens, providing a serene oasis in the urban landscape. The mall is commitment to sustainability and environmental consciousness is evident through the integration of nature into the city.

With a vibrant mix of shops, dining establishments, and cultural activities, Namba Parks reflects the essence of Osaka has dynamic spirit. Embark on a journey of discovery and immerse yourself in the unique lifestyle experience offered by Namba Parks - a true gem in the heart of Osaka.', 2, CURRENT_TIMESTAMP,1,95);


INSERT INTO comments (comment_text, article_id, author_id, created_at)
VALUES
    ('This is a wonderful blog post.', 6, 2,'2023-07-18 15:46:20'),
    ('I agree with your points.', 6, 2,'2023-07-19 11:37:22'),
    ('I love this place!!.', 6, 2,'2023-07-20 15:44:42'),
    ('Keep up the good work!', 7, 2, '2023-07-22 09:42:28'),
    ('Looking forward to the next article.', 1, 3,'2023-05-25 12:35:24' );


COMMIT;


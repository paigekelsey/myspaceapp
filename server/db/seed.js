const db = require("./db");
const {
  model: {
    Products,
    Artists,
    Categories,
    Users,
    Orders,
    Reviews,
    ProductsOrders,
    Cart,
  },
} = require("./model");

const faker = require("faker");
const axios = require("axios");
const ProductsCategories = require("./model/ProductsCategories");

const syncAndSeed = async () => {
  try {
    await db.authenticate();
    console.log("Database Connected");

    await db.sync({ force: true });

    // Custom Categories
    const categories = await Promise.all([
      Categories.create({
        name: "Classical",
      }),
      Categories.create({
        name: "Post-Impressionism",
      }),
      Categories.create({
        name: "Neo-Impressionism",
      }),
      Categories.create({
        name: "Divisionism",
      }),
      Categories.create({
        name: "Cubism",
      }),
      Categories.create({
        name: "Expressionism",
      }),
    ]);

    await Users.create({
      firstName: "Guest",
      lastName: "Guest",
      email: "guest@gmail.com",
      username: "guest",
      password: "12345678",
      userType: "GUEST",
    });

    // Custom Users
    await Promise.all([
      new Users({
        firstName: "Craig",
        lastName: "Ferreira",
        pronouns:"she/her",
        email: "cf@gmail.com",
        username: "cferreira",
        password: "12345678",
        userType: "ADMIN",
      }).save(),
      new Users({
        firstName: "Anthony",
        lastName: "Sgro",
        pronouns:"she/her",
        email: "as@gmail.com",
        username: "asgro",
        password: "12345678",
        userType: "ADMIN",
      }).save(),
      new Users({
        firstName: "Manu",
        lastName: "Swami",
        pronouns:"she/her",
        email: "ms@gmail.com",
        username: "mswami",
        password: "12345678",
        userType: "ADMIN",
      }).save(),
      new Users({
        firstName: "Hugo",
        lastName: "Sanchez",
        pronouns:"she/her",
        email: "hugsan@gmail.com",
        username: "hugsan",
        password: "12345678",
        userType: "ADMIN",
      }).save(),
    ]);

    // Generate Fake Users (not admins!)
    let fakeUsers = Array(10).fill(" ");
    let userPromise = [];

    fakeUsers.forEach((user) => {
      user = new Users({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
      }).save();
      userPromise.push(user);
    });
    await Promise.all(userPromise);

    // await Promise.all([
    //     new Products({
    //         name: "Mona Lisa",
    //         description: "art",
    //         price: 100000.0,
    //         year: 1900,
    //         imgUrl:
    //             "https://s.abcnews.com/images/International/mona_lisa_file_getty_190717_hpMain_20190717-061249_4x5_608.jpg",
    //     }).save(),
    //     new Products({
    //         name: "PROF!!!!!",
    //         description: "ART AF",
    //         price: 100000.0,
    //         year: 2020,
    //         imgUrl:
    //             "https://ualr.edu/elearning/files/2020/10/No-Photo-Available.jpg",
    //     }).save(),
    // ]);

    const fakeProducts = [
      {
        name: "A Sunday Afternoon on the Island of La Grande Jatte",
        description:
          "A Sunday Afternoon on the Island of La Grande Jatte (French: Un dimanche après-midi à l'Île de la Grande Jatte) painted from 1884 to 1886, is Georges Seurat's most famous work. A leading example of pointillist technique, executed on a large canvas, it is a founding work of the neo-impressionist movement. Seurat's composition includes a number of Parisians at a park on the banks of the River Seine.",
        artistName: "Georges Seurat",
        nationality: "French",
        price: 3200000,
        year: "1886-12-31",
        imgUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg/2560px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg",
      },
      {
        name: "Mona Lisa",
        description:
          "The Mona Lisa is a half-length portrait painting by Italian artist Leonardo da Vinci. Considered an archetypal masterpiece of the Italian Renaissance, it has been described as 'the best known, the most visited, the most written about, the most sung about, the most parodied work of art in the world'. The painting's novel qualities include the subject's enigmatic expression, the monumentality of the composition, the subtle modelling of forms, and the atmospheric illusionism.",

        artistName: "Leonardo da Vinci",
        nationality: "Italian",
        price: 40500000,
        year: "1506-12-31",
        imgUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/1024px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
      },
      {
        name: "Houses of Parliament, London",
        description:
          "Claude Monet painted a series of impressionist oil paintings of the Palace of Westminster, home of the British Parliament, in the autumn of 1899 and the early months of 1900 and 1901 during stays in London. All of the series' paintings share the same viewpoint from Monet's window or a terrace at St Thomas' Hospital overlooking the Thames and the approximate canvas size of 81 cm × 92 cm (32 in × 36 3/8 in). They are, however, painted during different times of the day and weather conditions.",
        artistName: "Claude Monet",
        nationality: "French",
        price: 13000000,
        year: "1901-12-31",
        imgUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Claude_Monet%2C_Houses_of_Parliament%2C_London%2C_1900-1903%2C_1933.1164%2C_Art_Institute_of_Chicago.jpg/1920px-Claude_Monet%2C_Houses_of_Parliament%2C_London%2C_1900-1903%2C_1933.1164%2C_Art_Institute_of_Chicago.jpg",
      },
      {
        name: "Irises",
        description:
          "In May 1890, just before he checked himself out of the asylum at Saint-Rémy, Van Gogh painted four exuberant bouquets of spring flowers, the only still lifes of any ambition he had undertaken during his yearlong stay: two of irises, two of roses, in contrasting color schemes and formats.",
        artistName: "Vincent Van Gogh",
        nationality: "Dutch",
        price: 82000000,
        year: "1890-12-31",
        imgUrl:
          "https://upload.wikimedia.org/wikipedia/commons/9/9b/Vincent_van_Gogh_-_Irises_%281890%29.jpg",
      },
      {
        name: "Painting with Troika",
        description:
          "Wassily Kandinsky, along with Franz Marc, Gabriele Münter, and Alexei Jawlensky, were members of the Blue Rider, a loose alliance of artists based in Munich. Although these artists did not have a common style, they did share a belief in the symbolic and spiritual importance of forms and colors and their effect on emotions and memories. In this picture, the troika, a horse-drawn sled from Kandinsky’s native Russia, and the hand-painted frame, which he made especially for this work, speak to the powerful impact of these sources on the artist.",
        artistName: "Wassily Kandinsky",
        nationality: "Russian",
        price: 18500000,
        year: "1911-12-31",
        imgUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Vasily_Kandinsky_-_Painting_with_Troika_-_1931.509_-_Art_Institute_of_Chicago.jpg/1600px-Vasily_Kandinsky_-_Painting_with_Troika_-_1931.509_-_Art_Institute_of_Chicago.jpg",
      },
      {
        name: "Composition (No. 1) Gray-Red",
        description:
          "After World War I, many artists, including Piet Mondrian, believed that abstract art could contribute to a more harmonious society by communicating in a universal, visual language. In the wake of the war’s destruction, artists associated with De Stijl (meaning, “the style”) in the Netherlands recognized the need for a break with the past, as well as a new aesthetic language to correspond to their utopian vision of the world.",
        artistName: "Piet Mondrian",
        nationality: "Dutch",
        price: 2360000,
        year: "1935-12-31",
        imgUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Mondrian_-_Composition_%28No._1%29_Gray-Red%2C_1935.jpg/1920px-Mondrian_-_Composition_%28No._1%29_Gray-Red%2C_1935.jpg",
      },
      {
        name: "Mäda Primavesi",
        description:
          "Mäda Primavesi’s expression and posture convey a remarkable degree of confidence for a nine-year-old girl, even one who was, by her own account, willful and a tomboy. Klimt made numerous preliminary sketches for this portrait, experimenting with different poses, outfits, and backgrounds before deciding to show Mäda standing tall in a specially-made dress amid a profusion of springlike patterns.",
        artistName: "Gustav Klimt",
        nationality: "Austrian",
        price: 950000,
        year: "1912-12-31",
        imgUrl:
          "https://upload.wikimedia.org/wikipedia/commons/a/a3/M%C3%A4da_Primavesi_%281903%E2%80%932000%29_MET_DP243354.jpg",
      },
      {
        name: "View of the Domaine Saint-Joseph",
        description:
          "View of the Domaine Saint-Joseph (French: Vue du Domaine Saint-Joseph) is a painting by French artist Paul Cézanne. Another name given to the work is La Colline des pauvres ('The Poorhouse on The Hill'). Cézanne painted the work in the 1880s. It was exhibited in the Armory Show of 1913 and was purchased by the Metropolitan Museum of Art for the highest price paid by any gallery for a work at the Armory Show.",
        artistName: "Paul Cézanne",
        nationality: "French",
        price: 650000,
        year: "1887-12-31",
        imgUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Cezanne_-_View_of_the_Domaine_Saint-Joseph.jpg/1920px-Cezanne_-_View_of_the_Domaine_Saint-Joseph.jpg",
      },
      {
        name: "The Great Wave off Kanagawa",
        description:
          "Kanagawa-oki Nami Ura is a woodblock print by the Japanese ukiyo-e artist Hokusai. It was published sometime between 1829 and 1833 in the late Edo period as the first print in Hokusai's series Thirty-six Views of Mount Fuji. The image depicts an enormous wave threatening three boats off the coast in the Sagami Bay (Kanagawa Prefecture) while Mount Fuji rises in the background. Sometimes assumed to be a tsunami, the wave is more likely to be a large rogue wave.",
        artistName: "Katsushika Hokusai",
        nationality: "Japanese",
        price: 34000000,
        year: "1831-12-31",
        imgUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/2560px-Tsunami_by_hokusai_19th_century.jpg",
      },
      {
        name: "Untitled (Skull)",
        description:
          "Untitled is a painting created by American artist Jean-Michel Basquiat in 1981. An X-ray-like vision of the head's exposed upper and lower jaw accounts for its misinterpretation as a skull. The painting is owned by Eli and Edythe Broad, and is located at The Broad museum in Los Angeles.",
        artistName: "Jean-Michel Basquiat",
        nationality: "American",
        price: 52060000,
        year: "1981-12-31",
        imgUrl:
          "https://www.thebroad.org/sites/default/files/art/basquiat_untitled.jpg",
      },
      {
        name: "Wheat Field with Cypresses",
        description:
          "A Wheatfield with Cypresses is any of three similar 1889 oil paintings by Vincent van Gogh, as part of his wheat field series. All were exhibited at the Saint-Paul-de-Mausole mental asylum at Saint-Rémy near Arles, France, where Van Gogh was voluntarily a patient from May 1889 to May 1890. The works were inspired by the view from the window at the asylum towards the Alpilles mountains.",
        artistName: "Vincent van Gogh",
        nationality: "Dutch",
        price: 830000,
        year: "1889-12-31",
        imgUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Wheat-Field-with-Cypresses-%281889%29-Vincent-van-Gogh-Met.jpg/1920px-Wheat-Field-with-Cypresses-%281889%29-Vincent-van-Gogh-Met.jpg",
      },
      {
        name: "PROF!!!!!",
        description:
          "A brilliant teacher, wearer of white garb, expert of Node. In European academic traditions, fine art is art developed primarily for aesthetics or beauty, distinguishing it from decorative art or applied art, which also has to serve some practical function, such as pottery or most metalwork. In the aesthetic theories developed in the Italian Renaissance, the highest art was that which allowed the full expression and display of the artist's imagination, unrestricted by any of the practical considerations involved in, say, making and decorating a teapot. It was also considered important that making the artwork did not involve dividing the work between different individuals with specialized skills, as might be necessary with a piece of furniture, for example. Even within the fine arts, there was a hierarchy of genres based on the amount of creative imagination required, with history painting placed higher than still life.",
        artistName: "Eric P. Katz",
        nationality: "American",
        price: 89000000,
        year: "2021-12-31",
        imgUrl:
          "https://media-exp1.licdn.com/dms/image/C4E03AQEXIPzS6uix5w/profile-displayphoto-shrink_400_400/0/1516270923758?e=1625702400&v=beta&t=FGBICg7ESPCBvb4mgbS-Nun8QCACSk8Snx9Rkeglszs",
      },
    ];

    await Promise.all(
      fakeProducts.map((product) => {
        Products.create(product);
      })
    );

    const artists = await Promise.all([
      Artists.create({
        name: "Leonardo Da Vinci",
      }),
    ]);

    const orders = await Promise.all([
      Orders.create({
        userId: 1,
        total: 42000000,
      }),
      Orders.create({
        userId: 2,
        total: 89000000,
      }),
      Orders.create({
        userId: 2,
        total: 3200000,
      }),
      Orders.create({
        userId: 2,
        total: 1200000,
      }),
      Orders.create({
        userId: 3,
        total: 903000,
      }),
      Orders.create({
        userId: 3,
        total: 1234567,
      }),
    ]);

    await Promise.all([
      ProductsCategories.create({
        productId: 1,
        categoryId: 1,
      }),
      ProductsCategories.create({
        productId: 1,
        categoryId: 2,
      }),
      ProductsCategories.create({
        productId: 1,
        categoryId: 3,
      }),
      ProductsCategories.create({
        productId: 1,
        categoryId: 4,
      }),
      ProductsCategories.create({
        productId: 2,
        categoryId: 1,
      }),
      ProductsCategories.create({
        productId: 2,
        categoryId: 2,
      }),
      ProductsCategories.create({
        productId: 2,
        categoryId: 6,
      }),
      ProductsCategories.create({
        productId: 3,
        categoryId: 1,
      }),
      ProductsCategories.create({
        productId: 3,
        categoryId: 2,
      }),
      ProductsCategories.create({
        productId: 3,
        categoryId: 4,
      }),
      ProductsCategories.create({
        productId: 3,
        categoryId: 5,
      }),
      ProductsCategories.create({
        productId: 4,
        categoryId: 1,
      }),
      ProductsCategories.create({
        productId: 4,
        categoryId: 2,
      }),
      ProductsCategories.create({
        productId: 4,
        categoryId: 5,
      }),
      ProductsCategories.create({
        productId: 5,
        categoryId: 1,
      }),
      ProductsCategories.create({
        productId: 5,
        categoryId: 2,
      }),
      ProductsCategories.create({
        productId: 5,
        categoryId: 5,
      }),
      ProductsCategories.create({
        productId: 6,
        categoryId: 3,
      }),
      ProductsCategories.create({
        productId: 6,
        categoryId: 5,
      }),
      ProductsCategories.create({
        productId: 6,
        categoryId: 6,
      }),
    ]);

    await Promise.all([
      ProductsOrders.create({
        productId: 2,
        orderId: 1,
        quantity: 4,
      }),
      ProductsOrders.create({
        productId: 4,
        orderId: 1,
        quantity: 1,
      }),
      ProductsOrders.create({
        productId: 5,
        orderId: 1,
        quantity: 10,
      }),
      ProductsOrders.create({
        productId: 1,
        orderId: 2,
        quantity: 2,
      }),
      ProductsOrders.create({
        productId: 1,
        orderId: 3,
        quantity: 8,
      }),
      ProductsOrders.create({
        productId: 2,
        orderId: 3,
        quantity: 1,
      }),
      ProductsOrders.create({
        productId: 1,
        orderId: 4,
        quantity: 1,
      }),
      ProductsOrders.create({
        productId: 4,
        orderId: 5,
        quantity: 1,
      }),
      ProductsOrders.create({
        productId: 5,
        orderId: 6,
        quantity: 2,
      }),
      ProductsOrders.create({
        productId: 6,
        orderId: 6,
        quantity: 1,
      }),
    ]);

    const review = await Promise.all([
      Reviews.create({
        detail: "I loved the Mona Lisa, 10/10 would go again!",
        rating: 5,
        userId: 6,
        productId: 1,
      }),
      Reviews.create({
        detail: "Looks good I guess...",
        rating: 3,
        userId: 7,
        productId: 2,
      }),
      Reviews.create({
        detail: "Its a fake, do NOT BUY!!!",
        rating: 1,
        userId: 9,
        productId: 3,
      }),
      Reviews.create({
        detail: "I hate the Mona Lisa >:(",
        rating: 1,
        userId: 4,
        productId: 5,
      }),
      Reviews.create({
        detail: "Looks great!",
        rating: 4,
        userId: 9,
        productId: 2,
      }),
      Reviews.create({
        detail: "Do NOT BUY!!!",
        rating: 1,
        userId: 1,
        productId: 6,
      }),
    ]);

    // const [monaLisa] = products;
    // //const [craig] = users;
    // const [leonardoDaVinci] = artists;
    // const [classical] = categories;

    // monaLisa.categoryId = classical.id;

    // await Promise.all([monaLisa.save()]);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { syncAndSeed };

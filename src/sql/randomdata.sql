use host_management_system;
INSERT INTO suppliers VALUES (DEFAULT,"Pastry Pro","pastrypro@gmail.com",22610366,"Arxiepiskopou Makariou",5,"Larnaca",4054,0);
INSERT INTO suppliers VALUES (DEFAULT,"Axna Fruit Market","axnafruitmarket@gmail.com",99312464,"Petraki Kiprianou",7,"Larnaca",4060,0);
INSERT INTO suppliers VALUES (DEFAULT,"GDL Trading","gdltrading@gmail.com",99493606,"Spyrou Kiprianou",9,"Larnaca",4020,0);
INSERT INTO stock VALUES (default,"KG123","Beef patty","Food","Pieces",40,3,"Paketo",0);
INSERT INTO stock VALUES (default,"AB2134","Pork patty","Food","Pieces",20,3,"Paketo",0);
INSERT INTO stock VALUES (default,"123","Chicken","Food","KG",30,3,"Paketo",0);
INSERT INTO stock VALUES (default,"KOPE","Soap","Cleaning Supplies","Pieces",10,2,"Paketo",0);
INSERT INTO stock VALUES (default,"EPIC","Toilet Paper","Cleaning Supplies","Pieces",20,2,"Paketo",0);
INSERT INTO stock VALUES (default,"ULTRA27","Buns","Food","Pieces",10,1,"Paketo",0);
INSERT INTO stock VALUES (default,"0bc","Lettuce","Food","Pieces",3,1,"Paketo",0);
INSERT INTO supplier_products VALUES(1,"Lettuce",3.5,"Pieces",0);
INSERT INTO supplier_products VALUES(1,"Buns",1.5,"Pieces",0);
INSERT INTO supplier_products VALUES(3,"Chicken",4.5,"KG",0);
INSERT INTO supplier_products VALUES(3,"Pork patty",5.5,"Pieces",0);
INSERT INTO supplier_products VALUES(3,"Beef patty",6.5,"Pieces",0);
INSERT INTO supplier_products VALUES(2,"Soap",4.0,"Pieces",0);
INSERT INTO supplier_products VALUES(2,"Toilet Paper",4.2,"Pieces",0);
INSERT INTO staff VALUES(DEFAULT,"Petros","Kiprianou",99342567,"giannhspapamichael@gmail.com","2001-04-12",1034567,"A3432C5",2,"Arxiepiskopou","Limassol","4321","2023-04-12","2024-06-25",0);
INSERT INTO staff VALUES(DEFAULT,"Kostas","Giannaka",99982347,"kostasgiannaka@gmail.com","2000-05-13",1034095,"A435I94",4,"Agiou rafail","Limassol","4612","2023-04-12","2025-06-25",0);
INSERT INTO staff VALUES(DEFAULT,"Andreas","Xatzitofi",99938457,"andreasxatzixristofi@gmail.com","1991-06-22",1038127,"D723H23",5,"Agiou iakovou","Nicosia","2021","2023-04-12","2024-03-15",0);
INSERT INTO staff VALUES(DEFAULT,"Sotiris","Papakosta",99539487,"sotirispapakosta@gmail.com","1997-07-02",1004569,"JD91KEL",1,"Agiou Andrea","Nicosia","2035","2023-04-12","2024-01-05",0);
INSERT INTO staff VALUES(DEFAULT,"Thodoros","Michaelidis",95012938,"thodorosmichaelidis@gmail.com","1995-10-20",1023498,"A3432C5",16,"Agiou emannouil","Larnaca","6045","2023-04-12","2024-06-25",0);
INSERT INTO orders VALUES(DEFAULT,1,"Pending",40,null,"2023-10-20","2023-10-21","Some comments");
INSERT INTO orders VALUES(DEFAULT,2,"Pending",20,null,"2023-10-20","2023-10-21","Some comments");
INSERT INTO orders VALUES(DEFAULT,3,"Pending",30,null,"2023-10-20","2023-10-21","Some comments");
INSERT INTO order_details VALUES(1,4,"3","Chicken");
INSERT INTO order_details VALUES(1,6,"5","Beef Patty");
INSERT INTO order_details VALUES(2,5,"2","Soap");
INSERT INTO order_details VALUES(3,2,"5","Buns");
INSERT INTO users VALUES(DEFAULT,"user1",SHA2("user1",0),"user1@email.com", DEFAULT);
INSERT INTO users VALUES(DEFAULT,"sotiris",SHA2("sotiris",0),"sotiris01@hotmail.gr", DEFAULT);
INSERT INTO users VALUES (DEFAULT,"xaralambos",SHA2("xaralambos",0),"xaralamposmicha@gmail.com", DEFAULT);
INSERT INTO users VALUES (DEFAULT,"raphael",SHA2("raphael",0),"raphael.athos@cytanet.com.cy", DEFAULT);
INSERT INTO users VALUES (DEFAULT,"matthew",SHA2("matthew",0),"paraskeva254@gmail.com", DEFAULT);
INSERT INTO users VALUES (DEFAULT,"manos",SHA2("manos",0),"emmanueloikonomou@gmail.com", DEFAULT);
INSERT INTO unitsVariables VALUES(DEFAULT,"KG");
INSERT INTO unitsVariables VALUES (DEFAULT,"Pieces");
INSERT INTO recipes VALUES (DEFAULT, "Pork Afelia", "default.jpg", "Pork slices with wine",
"Step 1:
1.	Add in a vacuum bag pork meat, dry red wine, crushed coriander, salt and black epper powder.
2.	Vacuum, label and day dot.
3.	Store in a refrigerator 1-4°c.
4.	Let it rest for about 12 hours.
Step 2: 
1.	Strain marinated pork afelia prep and deep fry them for 8-10 minutes till get golden color.(keep the strained liquid for step 4.)
2.	Add in a st/steel tray the kitchen towel and then transfer fried marinated pork on top to remove excessive oil.
3.	In pre-heated cooking pot add olive oil and fried marinated pork, then sauté for 2-3 minutes.
4.	Add water and  piece of leak and strained liquid from step 1 and cook for 1 hour on 180°c with lid on.
5.	Remove from heat, portion and serve.
",
"Step 1:	
Pork shoulder and belly chunks	2500 gr
Dry red wine	500 ml
Crushed oriander	20 gr
Salt 	2 ml
Black pepper powder	2 ml
	
Step 2:	
Olive oil	50 ml
Water	400 ml
Leak pc	25 gr
",
"December 2021",
"vacuum machine",
"",
"5 portions",
"3 days",
"",
"Always wash hands and thoroughly clean and  
sanitize food utensils, equipment and work surfaces.",
0
);
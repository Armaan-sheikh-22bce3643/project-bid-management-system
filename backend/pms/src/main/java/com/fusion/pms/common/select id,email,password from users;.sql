select id,email,password from users;
UPDATE users
SET password = '$2a$10$Kin2QPqYF/sB6jceS26Wnuq4hE6pzAJznHbTANtBmhBI7Mzl.0LtG'
WHERE email = 'manager@fusion.com';

UPDATE users
SET password = '$2a$10$Kin2QPqYF/sB6jceS26Wnuq4hE6pzAJznHbTANtBmhBI7Mzl.0LtG'
WHERE email = 'finance@fusion.com';
cd ./hashcat
echo "MD5"
time ./hashcat.exe -a 0 -m 10 -w 3 --quiet ../md5.hash ../10k.dict
echo "SHA1"
time ./hashcat.exe -a 0 -m 110 -w 3 --quiet ../sha1.hash ../10k.dict
echo "SHA256"
time ./hashcat.exe -a 0 -m 1410 -w 3 --quiet ../sha256.hash ../10k.dict
echo "SHA512"
time ./hashcat.exe -a 0 -m 1710 -w 3 --quiet ../sha512.hash ../10k.dict
echo "PBKDF2"
time ./hashcat.exe -a 0 -m 20300 -w 3 --quiet ../pbkdf2.hash ../10k.dict
echo "bcrypt"
time ./hashcat.exe -a 0 -m 3200 -w 3 --quiet ../bcrypt.hash ../10k.dict
echo "scrypt"
time ./hashcat.exe -a 0 -m 8900 -w 3 --quiet ../scrypt.hash ../10k.dict

# Import libraries
import matplotlib.pyplot as plt
import numpy as np

z = [0.0169, 0.0211, 0.0106, 0.0102]
y = [26.91, 41.07, 41.85, 40.93]
n = ["\nmd5", "\nsha1", 'sha256', "sha512"]
plt.scatter(z, y)
for i, txt in enumerate(n):
    if (i%2 == 0): plt.annotate("  " + txt, (z[i], y[i]), ha='left', va='center')
    else: plt.annotate(txt + "  ", (z[i], y[i]), ha='right', va='center')

z = [192.4, 190.3, 202.4, 199.7]
y = [5557.75, 10071.5, 35378.8, 269000]
n = ['pbkdf2', 'bcrypt', 'scrypt', 'argon2']
plt.scatter(z, y)
for i, txt in enumerate(n):
    if (i%2 == 0): plt.annotate("  " + txt, (z[i], y[i]), ha='left', va='center')
    else: plt.annotate(txt + "  ", (z[i], y[i]), ha='right', va='center')

z = [201.6, 199.6]
y = [2.7 * 10**11, 2.3*10**11]
n = ['mfchf-hotp6', 'mfchf-totp6']
plt.scatter(z, y)
for i, txt in enumerate(n):
    if (i%2 == 0): plt.annotate("  " + txt, (z[i], y[i]), ha='left', va='center')
    else: plt.annotate(txt + "  ", (z[i], y[i]), ha='right', va='center')

plt.annotate("↑↑", (200, 5*10**13), ha='center', va='bottom', color='green')
plt.annotate("mfchf-hsha1  mfchf-ooba6", (200, 5*10**13), ha='center', va='top')

plt.ylabel('Crack Time (ms)')
plt.yscale('log')
plt.ylim(top=10**14)

plt.xlabel('Hash Time (ms)')
plt.xlim(-50, 275)

plt.legend(['Standard', 'Adaptive', 'MFCHF'], loc='upper left')
plt.title("Hash Time vs. Crack Time for Various Hash Functions\n")

plt.arrow(50, 10**2, 100, 10**4, head_width=0, head_length=0, color='grey')
plt.arrow(140, 10**2 + 10**4, 10, 0, head_width=0, head_length=0, color='grey')
plt.arrow(145, 0.5 * 10**4, 5, 10**2 + 0.5*10**4, head_width=0, head_length=0, color='grey')
plt.annotate("Symmetric Resistance  \n", (100, 10**3), ha='center', va='center', color='grey', rotation=20)

plt.arrow(200, 10**6, 0, 5*10**10, head_width=0, head_length=0, color='grey', width=0.3)
plt.arrow(200, 5*10**10, -5, -3*10**10, head_width=0, head_length=0, color='grey')
plt.arrow(200, 5*10**10, 5, -3*10**10, head_width=0, head_length=0, color='grey')
plt.annotate("Asymmetric  \nResistance  ", (200, 10**8), ha='right', va='center', color='grey')
# show plot
plt.savefig('evaluation.pdf', bbox_inches='tight', pad_inches=0)
plt.show()

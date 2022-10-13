# Import libraries
import matplotlib.pyplot as plt
import numpy as np

# Creating plot
height=[60, 142, 162]
bars=("Standard Hash\nPassword Only", "MFCHF\nPassword + HOTP\n(Normal Login)", "MFCHF\nHOTP + UUIDv4\n(Recovery 1)", "MFCHF\nPassword + UUIDv4\n(Recovery 2)")

plt.barh([1], [40], color='blue')
plt.barh([2, 3, 4], height, color='orange')
plt.yticks([1, 2, 3, 4], bars)
plt.gca().invert_yaxis()
plt.xlabel('Average Entropy Bits / Size of Search Space')
plt.legend(['Password Hash', 'MFCHF'])
plt.title("MFCHF Demo Application Hashes vs.\nStandard Password Hash Entropy")

# show plot
plt.savefig('entropy.pdf', bbox_inches='tight', pad_inches=0)
plt.show()

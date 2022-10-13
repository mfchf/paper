import matplotlib.pyplot as plt

x = [12.5167235,24.2908806,47.5646695,94.3342729,188.4549572,377.0636352,753.2968366,1513.3490081,3020.4349785]
y = [1213.5, 1408.7, 1721.8, 2368.2, 3533.8, 6120.7, 10908.5, 21064.3, 40214.4]

for i in range(len(x)):
    plt.annotate('(' + str(8+i) + ')' + "\n", (x[i], y[i]), color='red', ha='center')

plt.annotate('(bcrypt cost)', (2**10.1, 2**10.3), color='red')

plt.title('Cost vs. Hash Time vs. Crack Time (bcrypt)')
plt.plot(x, y, marker='.', mfc='red', mec='red')
plt.ylim(2**10, 2**16)
plt.xlabel('Average Verification Time (ms)')
plt.xscale('log', base=2)
plt.ylabel('Average Hash Cracking Time (ms)')
plt.yscale('log', base=2)
plt.savefig('bcrypt.pdf', bbox_inches='tight', pad_inches=0)
plt.show()

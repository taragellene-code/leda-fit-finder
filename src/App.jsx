import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";

const LEDA_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXQAAABKCAYAAACrZK86AAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAABTbUlEQVR4nO29d5hcR5n2/as6qXNPntGMRpKVZcmWZEvG2cYJy8aGFzAsyV4WAxvA++0LC8vuxwe8u7ybCLvsLixcG0xOJhhwwgGcE7IsycpxRhpN7pnO3SdUfX+c6daMNBIGGwHavn315dHp6lN16pzz1FNPuB+htaaBBhpooIHffcjf9AAaaKCBBhp4edAQ6A000EADpwkaAr2BBhpo4DRBQ6A30EADDZwmaAj0BhpooIHTBA2B3kADDTRwmqAh0BtooIEGThM0BHoDDTTQwGmChkBvoIEGGjhN0BDoDTTQQAOnCRoCvYEGGmjgNEFDoDfQQAMNnCZoCPQGGmiggdMEDYHeQAMNNHCaoCHQG2iggQZOE5x6ge4Na9RhTX6/xhvV+JOa8oimMqDxxjXVyZedoH2I8fo5C/zq589SPvFv9fHnHdPoMbQexzvuuxG0HiHQ2d8WQvpyJhxHaUID6FL2t2NcLwKTpdJv9VgzubzO5gq/1WNsYCYms3kNMDg08jt138SplieVAz/TEbsCyoJYEwSAVwWvCMpg0ndoWnqReDn6Ghsf0COxMpNenrghkSrA98A0LbRvghT4hgtopDIwlImhBCDRAgKhcFF42scwBI5p4RgOQamCqQTL2pbNOs5n9g/rINlEEDFRlofEx/ElZmCCtvEllBwXJRRRT2IrSVya2CYoE7QBFhAFOuBlmQuAzOat+qkHH0CXKkQsk2pQxbfCa40aBsoPkBq0bVOSkktffT2tC2e/xl8V3/7e9/XtX/4SC5cs5l//8ZPHnXsym9ff//73+dYd3yGTyRCPxykUCiRjcd75znfy1rf83ozffO0739F//X8/gVuu8JnPfIbXbNgw4/vHHn9S/+///b8xbItEIoFhmVx//fW87ZabaY5E620nspP693//98nlcgRBgB2JUK1WMQyLL3zhCyxbtFC8sHOX/pv/+wkGBwcRQmAYBgvmzeed73wnK1asoDmZEAAT+YJuTibERz7+f/Qdd9zB+Pg4PT09XH311bznPe9h0fx5Yjyb03feeSf/9V//xZ//+Z/zmuuvEwA/+PFd+lOf+hTvfve7efubw2t95Ikn9d/+7d9ywQUX8J73vIfO1hax92Cf/tjHPsbQ8Ci+74MOWLlyJa//X6/histfecJ7tnnbdn3bbbdRKJaJx+OYaCzLIggC7rjjDprSSfGTh36qv/r1rzEwMMCD99xTP9cf3/anescL2/jud79LS3NaPPnUM/ofPvVJRkZGSCaT+L5PPp/HMAw+/vGPc/UrLxdHRkb1Zz7zGZ544gkcxyEIAqSUdHd389a3vpXrrrlaALzm9W/Q+/btY+7cuWSzWbq7u3n/+9/Pheetr/d/4NBhfdttt5HJZFBKYds2Z8ybzwc/+EHOXLFMDI9ndGdri/jB3Xfrz3z2n4nH45RKJaSUXHrRxbzzne+kt7Ozfr6vfPXr+r++dDuvfe1r+dM/+eP68bHJrP7EJz7BD37wA6SUJBIJrr/+ev7sz/6M9uYmMVko6v/+7//mvvvuI9A+ruviVqokEgluftvbePtb3/ayvjO/DMxT2dnOJ+/RL9z3RXR+ANcDLQy8wMcyBTFDYETTmB2Lub6nSxNf9JIn5cDYIf6///4kI9UxogK08lFKYRoOng/K0ARmKFhDYS4RuibQFYHUBIbA9atEIhEC10NUFdLXrFy8gg//yV/qFZEl9XFmQQ+58P/+xzc4WKoyFpRRUQlCYfsSQ1nIwEFJRcX0UEZAzI5A1cOo+BhSEmuOMXfeHJYvW8jyOR2sbG7RK5pSdL5UwZ4Z1y888yw/+NLXoFQkGY3gVaoYWqMqLulYjFK5gGk5eKbBpApY2NxJa8scTVPqZXtAq9Uq+/fvR5jGrN83pZMin8/rbdu20dXVRbFYJAgCcrkcxWLxuPajo6FAU0oxODg46/f5fB4MSbFYRKH53Oc+x7adO/j3z/xTvZ3Wmk2bNhGJRLAsi0QqhWEY5HIFakpPIpEgk8nQ399PR0cH+XyevgMHGRgY4HOf+xzNyQQAQgj+4dOf0XfccQeu67J06VI8z+OZZ57hda97HYvmz6M1nRJKKX3gwAHGxsbIFks6HY+JUqnEzp07mZycrI/NMAx2797NkiVLMM3wlY1EIhw8eJCh4VESiQRutcyOHTuYzIzR2tqqV5919qz3zLZtDh06hO1EsW2bQrGA4ziUSiWa0kkBkE6n2bdvHwMDA/z4Jz/Rr77mGgGQy+XYsmULvu+TzRV0EAQopSiXyxw+fBjLskgmkyilCIIAAKUU/f39HDp0iPb2dqSUBEGA4zgIEQ5xaGxcj4yMEI/HGRgYwPd9xsfHecc73sG3v/1tvXrlmaJ2zdu3b0cpRVdXFyMjIxw62EdfXx+f/+IX9PLFocyYmJigXA7no729Hc/zuP322ymVSnzwA3+u25rS9XaDg4Pk83kyubxuSSXFocEh/fGPf5zHH38cx3Fob28nm80yMDBANpulvbkJIQQjIyNs3bqVZDpBMpnEMkxGR0fr1/2bwqkT6NVJHVcFZP4IUXeMSCSBQqOEQhIgfJ9yqYA3YYHlgjuisTtekiAZK2UhIfGlpkwVHfhoAYYJvq8JhEaZHqAwlIfQEkNLNKAEBFJhRS3KhTyBVUVrRdR00D4UVJ7mSAuTvqubTFsAeIBlw2BFM2FGKceTVG2FBszAQiobI7DQAnyzSiB9coEHsRjxhI0tJePaY1/fII8dOkQTAVcsXsw1q1byioVn6M64Q3PtLfhlUXE5sms3TGax/QBbS8xShTYnilv1ieoykYqHGTFxA3ArZQp9hyBfgKbUS7kNM2AYBk1NTSQSiVm/z+YK2vM8hBBcfPHFXHjhhaTTaUr5AgsXLpzRdmIiq/fu3YsQAq01W7duPe58rusihODcdeu47rrrGJ/I8LnPfY4777yT195wo772iisEQEtTsxBC6M7OTm655RY658whCAKqVY85c+YAUCgUsCwLgD/6oz/CcRzu+tGPefDBB7nnnnv4k/e8G4CDBw/y4IMPUq1Wed/73sfVV1+N1poDBw5w/rpz6/evXC7XNf10PCYAfN+npaUFpVT9GjzPq2vAxWKR1nSKcrmMaZrMmzePN7/5zXR1tvO5z32OTZs28dRTT7H6rLNnnV/btslmsyxZOoc/+qM/oq0pjW3buK4LwGShqGv3KRqN8vWvf51XX3PNjHtnGAbpVEIsWLBA/8mf/Am5XI6/+qu/oqmpiTe+8Y0sXLiQpUuXAmBZFqZpMn/+fF772teybNkybNsG4KyzzgKgq61VeJ6n8/k8b3/721mxYgXf+ta3eOqpp/j0pz/Nl/7zPwAIggDTNEkkEtx6662YpsmPfnAnGzdu5Hvf+x5/+cE/r/fpeR6rV6/mXe96F9lsli987vPceeed/MHvv4O2pjQAjuOgtUYpRUsqXMz27t3Lzp07EULw4Q9/mHXr1pHP58MFr6kJCBd/IQSpVIpbfv9mlixZQjqZYmJignPWrJl13k8VTpFAn9SYAQnDJxLkSagcCa1xvQqGJVEqQKgA20hSUhXAA/HSVzpf+gSWompW8HQFjFCgS8vDNwUSgVQBhgaBxkCBCFVhKTRaKDy3gikDHEODKbE1SFdTymTwyNJlts4QsC7hg6cNB8dJUdEVQKKEhcBBCRtQSGXgSxdiMdCKoqsp+orQrRHBEwETKO7buIsDewfYtmQxV1+wjjULOrUFCM8lbdkvXrhn8wzt2kuHE0OqMgkF0jCxSmUsXyH8MnGpCaplpBGh2THZ+dxzXPSWN73k+zAdpVKJTCZDa0f7rN+nUwkRi8V0JBLh7LPP5qb/9doTXuPE5CTlcpmOjg769h9gy5Ytx7WJx+MUi0USiQRvvukNYiyX0319ffzo7rvYuHEj115xBQDZfE7bto1pmpx77rmsXb3muH6FEFQqFSqVChs2bKCzuVmUCkW9c+dO7r///rpAHxoaIggCWlpa+LP3vbd+nrNWLA/7mtLGhRAEQcD0Ndr3/dDkMyX0ajBNEyFEXUMXQiCEwHEczj//fM5avkQMDw/rv/74Rzl8+PCJpgzHcYjH4ziOwzXXXENXa9OM62xKxIXnhT4fz/PYvXs3/UNDOhaJMjo6iud5eJ4HwNyeOWJuT7jYffSjH9Vaa1auXMm1V11ZP6fruhQK4S7gqquuoqZtHwvf92lra+Oqq67i/HXniiAI9I4dO9izZ0+9jed5KKWQUnLhhReyYslikRkd07t27eKFF15gep9KKYQQvPGGG0XfyLDe9PONPPDAA2zevJnlixcB4QIdjUZnaNXj4+OUSiW6u7u5+S1vnnWstesvlUpceeWVrF+99jdmYjkWv3anqA6ymsADz0W5FczAwwwqSK+IdIvISglRKSC8CkagMNCgNAQvfY4sW6JFgBY+yghQpo8yfHzDwzeqKMtHC0VNFwqERotQcw+kIpA+VeViRUykKdAE+NUKUkpSiSRx4jP6MwhXyEjUQmiF57rgaQhABQJPaapa4SkdPkS+Bl+Fqr0vMHCwzCTSTAFJPJ2gbKbYPlLgR5u28YOnN7FxKEcZfjlhDmSPDDDad5BIEGCUSgTZLKbrQuDiRAykqbEcE9cvowKPaMTmUP9+yOde8n2YjmQySSKRqGu6s2FiYoJcLnecUDsWUko2b97M3Llz6ejooL+/n4OHB2Y4hcrlMqnU0R1GWyollixZQj6fZ9u2bfXj6WRKCCGwLItSqXRcX9liScdiMaSUSCkxjNBk1NnZieM4FAqFelvHcahUwudkNtS0cTiqwdbQ2tpKJpPBMAyGx0NHtWVZVCqVGe1qdu+mpibi8fA5XLVqVd2OnZkcn9U5ls1mMU0TrfUJx6eUIhKJ4Ps+1WqVe+65h7amtOjo6MAwjLpAmw7Lsuq7jemIx+OYpkmlUglt/SeA67pIKes7k97eXnK5HKZpsq+vX8OUoqQ1tm3Xn5/m5mbi8TgHDx6snysajaK1rmvU8zs6RXNzM4ZhzFj04/E4o6OjdHR01I/VdnttbW1ki7M726WU9Z3K2NjYCa/pN4Ffu0AXRlpgtAsw0FJiOhEM00YIA8uKIoWDYaZAxIEoltUMKgaRrpcs0S0tMAKNVBoZaAwFUgXge2jfA6VxhcAVEleCJ8AV4EmNJ8IPtomLJpPLUw0UwopgOhHcAEaDzIz+XAJcQKsituHjyABHagwB0tBgabAVyvGQtoth+gjLBAwiyiDuQqwsiJUN7KqN4UUwIm3I1h6OGFHuemEH337iafb8CgETo4cOQaWKFXikHJu4IbEMTUUGlG1N0dQUTUXZ0pTwKLhlcoU8A30HX+ptmAHf9/lFjvhoIk4qlTqpAADo6+ujVCqxcOFCurq6sCyL/v7+GW2klFQqlRnH1q5dSzqdJpvNMjw+djQCqlBACEEsFjuur5pG7XleXUuHUEurOfpqSCQStLe3MzExwXe+/4NZL3ayUNSRSGTGuSBcgCA0b3S2toja37XjjuMAocZeM8HUfAvVaujrMU1z1kUJQpNLqVSqC+zZUBNqqVQKpRRPPPEEmVxe+77P5ORkfQzH/mY2gV4zU0Wj0bpZp4aJ/NEHORaLYdt2fUzRaBTDMOpCHKCpKbRfu65bb1cz3U3f5VSrVSqVyoz+XNet75pqMAyD1tZW9u3bVz/W2dlJJBJhy5Yt7N69e9b5qV1XtVr9hUrHqcaps6Fr8LQEYeArQTUIMISJFiZSmASBRwWB1jYEL886owOFgcDExJA+Qgo8BUKBUhpDCJQ00VKgp9R0MWV+URIQEi/wicViKF9jSwe36CGUpDMVpcloBmAiyOhmo0WYSCxAqQAtNb7vI6SJlholBEhFaE7yCIIqUmtwDWQgMAKB1AbhQARSGihTki8VsFMOnhGQyxzmp9u2sqK3m6XnrNRdxot0lI4N6v79+/DKBSrlKqlYHN93KVWr+KbADzzcwMMywYlF0aZBoVjBikQ5tP8gPeNjmta2l2Vb6XleXRubDRP5go7H40xOTnLPPfewa9curZRi7ty53HjjjczrnlMfx5EjR8hkMixZsoRiLs/evXvZtGkTl154wYxzxmKxGYImkUhw5MgRlixcNEOYxmIxBgcH+dKXvsRXra9r0zS5/PIr2HD1VQJC7TYWi5FOp+vnq1QqZDIZli9fXj/P+rVrRHd3t966dSv/5//8HzKZjL7pppvqdloITRvValVHo1EeeOABdu7cqS3LYt++fbS0tMxwALuuSyQSQSlFtVoFQsHvOA6GYdQ195oPIZFInNBHEUbuGGQyGT7xiU/QkkpqKSWvfe1rWbsmdKSapkm1WmX+/PlUKhX6+/vZvn173ZY/fadQQ03wHuviMQwDIQSDg4N85Stf4Xvf+54WQrBmzRre8sabZphmag5wgJ07d9Z/v3jBfFGba63D96o2hv3791MoFFi+8sx6n6Zp1nctAEcmMjqfz1OpVJg7d279eKFQoFKpzNDQFy9ezKJFi3jsscf40z/9Uz7wgQ/o1914w4yLak2nRLlc1s3NzXz1q1/loYce0oaQtLW18fa3vpXmdNNvzARz6gR6tENoTO0qiNk2WoGPQCMQWqCkBYaNqwTYkZelS6kFKIFQAqEkoJBIhClRCrQvkVKg0AQqwLFslOfjeR5WxAojYqRBpVRGBaE5xjJNpC8oFHPU1ItmI9SkJAINBDgoEUHJGNo0Ua4LyQh4HnhlSEdRBR/LkPjFItF4C57rhud3bCqlCoEWWKYFOoKrdbgYzGlnrJrnjvvv5rWrVtIVfbETYfLUE08QjdhEEVTcMp5fJhKLggItJEY0FFBaKVQlIG1EqJR9XnjyWc5/+y0vy/2Aoy/4iaIBmpMJ4XmeTqZT/Py5jTy/ZTOmabJ86TIuvfRS5nXPqbfds2cPPT09pFIpFi1aRLlcZu/evcf1d2x0jJSSZDJ5nP1aa02pVOK+++7DtG2CICCRSLHh6quAUGuUUqK15u6776ZUKukf//BHGIbBpZdeOqOP97znPeRyOTZu3MinPvUp7r33Xv70T/9UX37xzJBcKSVbtmzhmWeeqZsRjtWcTdNESokQor4Q1jTiQqHAXXfdxX2G0N/5zneIx+MsX76cplTzSYXK2NgYDz74YOhDMozQb7Dm7Po81ByLr3/96/nMZz7Dli1b6g7E2TT7mn1/ujO3hprd/dFHH61/XygUeMsbb6q3sW0bz/N48MEHOXz4sP7KV76C67qcd9559Ta+79fn4b777uP7pZK+5557KBQK3HDDDTP6E0KQyWS4/Vvf1P39/Tz66KMkk0kuvPDCGXMvpZxhQupqaxW33HKLrlarbNmyhQ996EP88Ic/1LfddhvnnH2WgHB3VdtNPPbYY6FzNVCsWbOGN77hDSeb9l87TmnY4rGQWqGEH6rFEKrOwgd+eZPCbAiERAtBqKfXNDSBVCZCBxjKAi8g6jj4noesKkwsbCWxPBNfGQhTgBR4gY+jLUQF4sKhPdqKPEZBrumcCgNfWPiY+EoSWtcFmCZIB4oFYr6HWSqTjKQpZUdJxONkxseRQYJEUwvFkodbKYJjg/bAciDwqBoWY+UyP/v5JpZcsvbFTUR2grGREYxSiSgCDFBS4AVBGM6jBRgaUAilMZEIBEKZHNlzAMZz0Nr0stwT27aJRqPHaXLTUdOmrrnmGpYuXYrv+8zp7KK5uXlGu8OHD+M4Dh0dHZgijBfesWNHPQ4cqGt004VQEAT1UMfp5h/TNGlububSSy+lvbOTcrnMZZddNmPs2WwW13X50Ic+FNpolebcc8/lggtm7grOPnOF+NjHPqa/853v8Nhjj7F582Zuv/12urq66uF1NSfrZZddxtlnn41lWWzZsoX777//OMFYG29tZ1AL/9u2fQt9fX2USwWSySSvuvpKzj333BPObSQSwTAM2tvbedWrXkV7cxOu67JgwYJ6m5pD0bZt1q9fTzKZ5Oc//zmlUgnLso4zndTGI4Q4btw1e3c0GuWiiy6it7cXwzCYP3/+jHbVahXXdfnWt76FEIJcLsdll13GW9/61nqbWCxWD2n85Cc/Ge4YYnGuvPJKLr/88hntKpUKw8PDfOQjHwk18zndvOENb6B3zlFTrm3b2LZ93JivfuXloqWlRd9999387Gc/4+GHHyadTtP94Q/rrrZWUVMECoUCN7zm1cyfPx/lB3R2dtLV0fkb087hVAp0f1ILfAwdIHWAgUICAoVAgBAY2EhRBFF+ebqU4EmJEhII48G1NhDCQGFgKpsWabN20dk0J5uwtEXMjKA8n4AALaDiVbEcG7fiEo/EUcUAKzBojTcRcy2YZkJLgxgGrYQkEGG/oeAS4IbJH0hNvOJxw1mr6IyaiFiM8UIBGY+xra+f/aMZMoUjmFYCKR0MAZ4nwYlBpYJyYmTcCj964udce8la3fuL4tNLWT207wDlfJGkBmEZoUPMNkEIzMBAKAMfhUIjFBhIpBAIBcPDY5T7DhFdOu9luSfFYpFqtXpCGy+EQkdKyStf+Upu/r3fm/X6MhNZvXPPbizL4qmnnmJyPFMXNplMph4Tbts28Xh8hsllYmIC0zTrGncNhUKBnp4e3vCGN3DeuvXH9Vsuh8k4ra2tXHfddbzwwgsc2LefG2+8kRVLFs9IKgJYNH+e+IsPvJ/7zz1Xf/rTn+aZZ57hwIED9SiLmuP0Fa94BW9+85tpSsTFl7/+Df3QQw/NMGtoreufY48tXLiQV77ylaRTCebMmcOKZUtYsmjxCZ8Jz/MoFou0tbXxx3/8x3S3txzXthZpYxgGCxcuZOXKlezYsaO+EM5mLqst0Mf6R7LZLEEQ0NzczM0338wrzj3nhGNLpVKcc845dfPOZZddxtqzVs0wy9Qcktdeey3t7e2kE0nWr1/P/J7ueruaSWbevHlcfvnl3HvvvbQ2NbNhw4YZ/WmtKRaLx9n9Ac5dfbbo7e3VK1eu5B//8R955JFHuPXWW+lqa0VrjeM4xGIxXv/613PVpZf/1kS5nEIbukJqhSD8f/3v0OgSCnbhIfBAuKAmNfKl2aKUmIonnzqLgFC4Tx2X2qDJaeHS1ZeyevlqItIhKh3csovyA+yIgy8CTNOiUCqQjjUhlQZXIV1Bwp75MmRB+0DV8HENH08qTGGCZYa2cd/Floq4X+XV687hvEVtlALwDBivlBg6dzmP7drN1374EzBDjT7w/HCwvgUqAkrgmz4vHMmwewx6237BJASajU8+S9SyiWkwEfheBS0FCBmODwhEeBekFIgApNYI3yfiOLywdTPrr77opdyKOmKxGJFI5KTOpJr2M90OeiwKhQKHDh1CGJJvf/vblPIFstksLU3NHD58mEXz59Xb1ULdaqglgGit6Z1zVBDUFpJodHZbVi0c7tChQ7z3ve/lhz/8IZ/8h3/k8OHDdUFeE+bTsX79etavX8+WLVsYGRmpH08mk3UnbFMiLiC0f5fLZaSU9XPWom8Mw5ihTZqmSXtHG29729s4c8nCF/WuJJNJIpFIfV5mQ81h6rouzfG4uPDCC/WW5zdTqVRmmH2moxY1c6x9PRKJEI/HGR8fn9XZXIOUEtu2ufnmm9m8eTP/9m//xqZNm2a0qVarmKaJaZphvPqS2ReuUqmE53l0dHTw7ne/m9HRUR5/5NG6Y/nYMZ9oHjpamsWaNWv0mWeeyQMPPEAmEwZBGIZBtVoNfWS/YlrIrwunlMtFzFi8p7RmBGranMiQSQSYfZJ/eUx5QYVCizCRSQtFMBWuKLVNa3IOHWY38+U80UGnmBvtFfOSC0SXNUfMNeeKLjpFyuiknVbRKttEa6RDNKfaj7uTFaAMVE0X13DBcPGpIA0FpgJbYAoXXcnSETVYYiBW24h1BmJ93OFV7S284+Lz2bBmOQldQZWy4LuYWiArgIoTVA2E1UzOTvLo9t2M/iL7lBY8+8jjxKWFdANEoAhchUDi+j4+GncqokcZInQQm+E90ARYlsHTzz5dP10WpSdfgk0sm82eVJhAGMkhpTypFr9p0yaUUixcuJDrr7+em266iY6ODnK5HIcOHaq3i8ViVKvVGXbSzZs3o5SqJ79AGIdeMzWcKApHa00kEqlH4NTMEc8+++xxwmI6mhJxUQtPnB6uWROO0+eiZh6yLIvpi0NNIz/W5j+b+eNkqGnejuOccFGtjasmnNeuXUsqlapHdczm/1BK1U01x56rUqlQKBROGrVUu+fVapVVq1YRj8d57LHHODQ4NONmGIZxnN37WEgpcRwHpRTJZJKFCxdSKpV48sknZ7SrnetEDmQIF1jbtus+i9r5gbpP4bcJp0agq5DoSQvQSAJhEIjQzuwJmwCHQNhobaHEFJmJfulDk6hQ09QaMbUjgGAqlMUHEaADH+X56F+wgHQ4x2tes1wooYFlqi8Vmqa164MbPoBaakxTAj7ZIKg/rC0YogvEYuCG9etJmgrD8NGGD1KjVYBpmOAplDTQyRhPbt9KZfaBHEU2z8CBPqSv0NUAqcCeEi5aa/ypuHsPhYtPIFV4HUIj0SjXZd/uXTASvlhppBD8ckJkOmzbJp1Ok06n6Rsc1ABj4xO6FsI2NpnVxWKxzuEylsvpyVJJHx4anvFiP//887S0tHDVVVfx8b/4sPj4X/2VWL16NZOTkzMEOlAPpxudmNRPb9qkH374YSKRCK94xSvqbdLJo/QGY2NjjGTG9UQ+p0cyE/V+a9maQD0GfM2aNWzdupWBgYEZfR44dLj+u8effkY/99xzJBIJOjs7623y+fwJhdz0RSUIghmherXva1mws4URngj5fL4eTTI0NASE2bkjo0fj1mvaZy0CaNGiRSxbtoxSqYTrurPmENScpccK2lp8ummaTExM1I+PTc4kf3Ndtx6KuWrVKubNm4frutx///31NrZtUyiEVAzTww+PhWVZ9aigtnhCnHvuuXR3d/PQQw/NCJWsmVum0yyMTkzqwdGjoay7du1i586d9WcWqC+4tRDKkcmMzhYLerKQ/40TeZ1Cp6gkECa+NPCVTTClnWskAgOFh0+MQMcAB4yXHvpjBaFANfRUwhIKLQJE/ZiLaXhIqli89MzUyNQn5kEsMKlKgYVFxQ/wpAZDUFaaVDyKH3XQs9jurBIs7+plTlMrmVwZV2t83wuzVw0N0sVTVYTpcXg8Q9ELwJqdFwXg8NZtSF8hEdjCwFACiUmgQEoTK2LjqgC0QmnwVYCFxEBjC4HwqwSFPEf27aW7owuANL9cUtN0SBlyqjzzzDN88IMfpFqu6KjtcOElF/O+P/pDkAJphqaFu+++m4ceeqiuhb761a/W77rlFgGwZcsWyuUybW1HbU4LFizgYf2zGZwuNcfnk08+yW233UbfoTAE75VXXcnatTOdylprBgYG+Jd/+RfsSATP89Ba8OEPf1ifd85aUdM2s9ksi3p7RbZc1uvWrePee+/l29/+NuvXrgHgx/fep7/1rW/R1NSkW1tb2b59O1u3bmXdunX09PTU+6uFU07XeGu7ANd16yYX0zRxHAfLsuqCfrog/2W09FgsRjKZZGBggL/5m7+hmJ3UsVgMx3H4u7/7Oz23Z46QUtLc3FzX4FuTSXHBBRfoJ554gkI2N6tAr2n8x5pjqtUqWmsmJib41Kc+xWc/+1kdBAG9vb3ccMMNuhYSWtPwk8kkLamkOPPMM/Vzzz3HPffcwx/c/PZ6H7XnR2vNZKGoa6aq6TAMox7iCNDW1kZ3dzfbt29n165dnL/u3PpcH7sb+8lPfhLa3FtbdTKZ5IUXXqC/v59rrrmG1tZWamMNnw3N5z//eW6//XZyk2FI6+te+1p9+pNzybRAgg6t58d+GX60PObvl6lrrRD4odkFhZg6t5zS1gPp4RkVfMpk8bRUkqRsnfWG5FVGJ+XxTqQa0kgxDNpU4cT6SLQGKQxkxERYiiCvcNFUXI/ZNo3NMURbYOqe9g42j+1FOBJUBW0KEAHCFPjaQwQ+ngEl3ydLoGfNHM1l9fZnnyNlGhiuImKZiCDA8118BYEtMdJJpOdhlgsoN8DQGq2nsmYBS0AMSd+OncxZsUSLppfmxY9Go/T2zCWbzzE6PILyfHJSMjo0DIApDTra2untmcvo8Eidoc+2bcZHx+ovcalUYtWKM1m6eAnZclmno1GxdvUaHu6dh9Qh7emcrg5Rc+wFQcC+fftIJBK8853v5MYbb2RBd/eMa+nu7iYajTI8PIwitP96XlDfkheLReZ29+B5HjVmvzlz5ugrrriC/Xv2Mp7N6dZ0SiSTSeKRKD/72c+olsokm9Kcs3oNb3vb26hFuNTnortnhm05FQ+dm+lEsm5yicVitLe0kkqlMEX4/EYsm+bmZjo6OohGXnxyi/J8Ojo6iEQiHOo/iGOGWaijo6MzTA/JeKLuLMwWS3rFihWsXnUWe/bsmXVXkU4kiSUTxCMz/Q+OadHU1MScjk7y+TxSg68VEcuekQMwf24vwjSmTK7wmlffwMMPPwyBYseevXrFksXCdV0WLTgDOxrBr7o0zTlemAPEozFS8QQLekM/yrlnrhTrzjlXHzk8wOOPP14X6D09Pcyd0z0jDr29pZVyucwjP/0ZZbeKY1pccskl3PqOP2BuV/jstzc3iXgkqufNm8focEgq5nkebqVyUlPQqcAppc8dePQbeusP/p6mYBhzSikJREhjq/yAipXCa17KNR/6NDgvnW3x/q3360/e9W/0Fw8ihUJoUFoiDEmgXBxh0Blt46K1F3HW8rMwtEVQ9LCsaJhc4VcRBujAx9ASoypoj7az/gT0vpOgM8CNH/xrjphtFGQSgYmnFdpQYAQI5dNSmeBLt72T63tmjxXe5QX69qe28tk7f0Il1oqSEnTIL6O0CTrAEYo5qsi/vftNXNd7vJAtlTI6pgVfePt7GNuyDb+QIy4MHE+D1JSkohyxaF06n0Xzz2DjPQ8R8UNTURAEWHYEJQ1cT1GMOfRefj5/+K+fgdjJ45t/EQ4fGdCDg4P1rEyhQ+deV1cXixaF9/xA30E9MDBQd0I6joPnebS3t3PWylVicnJS79mzB9d1WbJkCR0dIYnbwMCArrH+9fb20t7eLg4ePKiz2WwYbaEV6XSajo4O5nb3zLiOzOSE3r9/P7lcrs4EWCwWiUQirFy5kpamZjGWGdf9/f1UPY+lixfT2twiBgaP6EOHDhF4PouWLK6HrW3ZskWPZcYZGxmlqaWZ3p65rFixYkafg8NDeu/uPfTOn8eCeWHyzMGDB/XI2CgtTc0sXhw6/Q4NHNYjQ8PEEnFWLFsuAEZHR3V/fz/xeJzOzk6am1/cfRkZGdF9h/rJ5XIYhoEhwkza5uZm1q1bJwCGR0f08PAwruuy7pyQTCwzOaH37g55VZYsWTKjv6GRYX24/xBIQc+cbubMOZr8lc1mdd+hfjJj40jTQCJwfY9UIknnnC56e+aKyVxW79uzF4Vm3txeOjs7RTab1Zu3biFiO8w/YwGd7R1ifCKjD/X14wU+c7t7ZvQzHQf7+3Qmk6FSqXDh+RfUn6lDhw6RTqepMVH29/frw4cP0zmni0VnLKwlj+n+w4cYOjJIrpCnKZVm/hkLWLxwpjzat2+fPtB3cIYTOOpEaG9vZ+HCF+eg/nXg1Ar0x76mX/jeP9IUDGIHgNB4wpgm0NN4zcu4+i8+CfZL5+H+ydYH9T/e/c/0F/sxagJd2UgDVOBiSoEqezQlW0hGUgSeRvshV4QWoSbseRUswyaKSTSIcvaC1bzp2jexuGPJceObAD0B3PjBjzNgdpAzkiBMlA5ABiAUQge0lbN8+bZ3cO3c2V/CvUrrrzzxAp+98wEKkSZ8yZTNX4C2QQlsoelSRf7x5uu5esk8mmcJX6we3KU//473Udq7HxF4RKTEdsPwxJzUFKKSBResY92atTz6pe+gMjmUCgnMlBlqgoGnqdg2zevO5k8++QnsRSt+Yw9rAw00cHL8RhOLftPQQhFpTZKtlBmfLGAIG9Ow0SWNF7gE2kcaYJsWsgJG2aC1vYey8+v1bNtSYBkmlmGGUlpLxFSyTy16HzRaQKFYPKH1v3/vfvLZHDJQmIZAMGUzlCK0apkmqa5O5q88k6dbmpiczCGRGKZAax+0xBYGgYDS5CRD/YeZt2jFr/XaG2iggV8d/6NrimoB+XKBsl8Oozts0EaAKyr4hot2NMpWYIF2AFsjLYm0T+yEfDlgAJZpYksDoWZXiNXUp+K5J8ws6t+zD+V6GGHqVpgwohVaCqRhICMRmrp7aO7tRUdjlLUiMMIkL18pDBm6rW0klckswwcPnaCnBhpo4LcB/6M1dKHBEhLbEkgMlPLw/CpCaGxTIC1BsVigKl0s38JRUYQKCCrlsD7crwkSMLXEQIQr7pSGHppcpmJgp5yWru/NHnA5Oa5H+/pRbjWs1CQ0BAGWMEOTChpMi84F8zCam9CJGFVDYhsSXwco7WNKEx24iEAQFMqMHOz79V10Aw008JLxP1pDB9A6zBispTVr1BR5lEepVCCeTBCJ2FiWie2YmJb8hfSvLxX1m6JCp6HQ1L3/wAxrua8VwSx5PkFmgsmBYXS1Wg/dk1IiTINAa3ylEZZJ78IlEE/R1NGJiERQhiCYSpZQKsAQOgzx9H0yhwbh8OFT53RpoIEGfin8jxboWoSMjz4aJQ3MSAQnEkXaFtow0YZJoVKmWHUpeS4l18MNFIE0mKD8axNsmlCAC6VnCHIxS49SyimDykxkDh1hYuBIyKYnQAiNMCRIQaAV0jRIJtO0d8+Flk7RM3cethMl8EM7u20Y6EBhGrIu0CeGhpgcOPLruuwGGmjgJeJ/tMkFwJQWQaBD6a4Enh/g+y7SNklEwwQP05AYgYEpbEzhYJsOzURPUbTHLGuu1nUt3TTNWVfl4tAYpbEMUdPCnOJnD4tkSwIN0jLDzLdYEoC2llYs06Tq+9gizLZT1QoaWWf6y4+NMzE8StOv7VobaKCBl4LfKg19Ol/Cy3W+6f+fDq01UkkcZRLxbYyiwK4YRF2HhIrRLNLYJQOnbGIWJQkVQRcCTE9g/ILEvFn71Tr8MHuG2ozfA6VqBWmZuIGPZYW8FIHvY1gGaI0OFAJNxDCOX5UnJvTQ/gN42RwmOuSHVlOl/ab4MnzfZ9XyFVD2YLKgz1qxCtPXmFqA0uhAYxphwkoQBMSdKGPDQwydpF5lAw008JvFb52Gfirj4qWW6KLPigUraEu3hwnvribwfKQpKFVLxONhEdmUk0SVYeX8VaSME7MAvhyoAtowmSwUMeIteFM2bTHFgY3ykRIsJFHLPt7gUq6QOTKIrQTlShHpu1h2WOFcSE0ymcS1LCZHxpjY+DxKacoH+rAUSMNAT9WSNAQIaWIYIXGCrQWjAwMwNqZpe2kVjDZv3qyDIOCMRQtPSYWXscy4LpVKmFOFoKWUWJZFOn48R8+hgcO6t2du/fjI2KjWgaKzc2YC12Quqz3Po31aNadDA4d1NBqtVxeqETt1tB0lc9u9d4+uUffaVlgyrrkpdcI52LN3v64lsJyxYN5x7fqPDOgaI6M5tWDH43GaUumTzuv4+Lj2A00mk6GlpYXOjuPv6dDwqC6Xy7P2OzQ8qqWUdLQfzaweG5/QSql68RDHcSiVSvR0H+UhP3T4iK6xTLpByOpYq0Q1kpnQHS1hfsboxKT2PI/ujuOJ8AZHx3S1WqVSKoSJVSd4hoZHR3Q+n0cIUU8eOp3xWyfQTyUMDUt7FvPW697A2kXnYk39Z2OhEfi4GBhUKGFh43ouMRUj6cxODfByoewFVH0PVwVoUxLoACQYZuisBY2BwBKQjsePE+jB5CSH9+7FUoqIEwHbIOJYlApFvEoVTIfCRIXNTz3LD+65HyklvdEk5ZFhWpIxLCdCyQvJwDzPR1o2KlAY0uDgrj3ofAHR9ot4e0+Mz3/+8/o//uM/uOaaa3jj772J5tVrXsp0vSjc8b3vsW3bNqrVap2f+5prrmHdunW6ZZrg27jpOf3vX/wiV11xhb7m2mtpTqbEo48/zv333cell1+u3/LGNwkIF4jPf+ELjI6Ocsstt+hzV68RAJ/9139ldHSUSCRSZ25MJBK84x3v0CuXLReDoyP6nz772fputFwo09TUxGWXXaZvvOH6Gbdy774D+o477uC5556jWCySSqWYP3++/ru//US93Ze+9lX96OOPYVlWWD+1VMayLK7fsIEbrn/1SefkyJEjfOGL/0Eul+PKK6/klpvfNuP70bGM/uhHPwrAZZddpt/y5jfV+/3v27+sn3zySdLpNO9973v1/HnhAviNb3yDHTt21Kl+awvN6173On3JxRcKgG9/+9vs3LkTKSVlt0pzczPnnnuuvvHGG6kJ84l8QX/oQx+itbWVm2++WZ+1Ynm9770H+/Q3v/lNNm3aRLmYp7Ozk7a2Nn3rrbeybMnSGXP4zW9+k+3bt2NZFh/4wAd0LSP3dMX/aIEutGBiLIOtLZLE0UATx2sDaHRKtApOXKj+ZcMEvq5qxaGREZxkgtLUAJiqCINSWLaJ5XoYBLSlmkgfkyU6PjbGUP9hHMDzqijtYpg1uk+NLQ1sQ5MfzdDVlKKQy0OxSGs8jtQKHWiUgsCUKAS2NMCHqDQY3n+QUmac+BkLfuVrvO+++7jyyit585vfzNlnn/1rf8EykxN6y5Yt3HvvvSSTyTqd609/+lM+8pGP8NpXHy1fNjA4yJ133smCBQt40xQDY6FQ4Md3340TjXL55Zfr7o5OUa5Wueuuu2hvb6/vKrPFgn7kkUcYHBykra2tznnS29tbpwK2bZv777+fTCZDd3c3lrQoFArs2LGDBQsW6LPPWlmfj//8z//ku9/9LrZt09PTw+TkJP39/WQmsrqlOVyEDh8+zAMPPEA8HseyLAq5PM3NzZw/rXTbiTAwMMCjjzxCLp9HSnmcQA+CgHvuuae+o7nmmmt0W2socO+55x6effZZzj777Hr7icmc3rlzJz/+8Y+ZM2dOnZ1xzpw5XHzxxfV2W7Zs4aGHHqKzs5MATTab5YEHHiAIAt7x9nAMzcmEePDBB3VPTw9XXHEFZ604WrP19ttv58c//nFYaWneXHbu3Inv+7zyla9k2ZKjlMgADz/8MJs2bcJxHN75zneyYN7MSkmnG36rBHrd3HKKzC4aiCZT2IkUHgbmCSR2Svx6NfLpEJhoQ7Gnrw9sEx2oqQIZAq0D8ANs20H7BRwH2lLHczkf6uujODFJAoGvNZ4K8DwP0zRAgykkcSeCVApLaYQOsLwAaZr4FRdhS7RhooRESQMFiEBjW5LJzASjff3ET1Lm7BdhYmKCNWvWnBJhDqCn6HMdx+Hd7343Z599Nps3b+af/umf+P6dP+DMVSv10gXhdtxybCzHJpaIM57P6tZkWixdvoxoPMZkLku+WAA6KVcrjGXGWbBgAZFIWAO3xo193nnn8cY3vpHOzk5isRhBENS51yuVCkopli9fzgc+8AH8qs+PfvQjfvrTn3LXXXdx9lkrAdi5a49+4IEHkFLy/ve/nwsvvJBKpcL4+Dg1YQ5hslgsFuOmm27iVa96FZZlUSwWmd/7iytMDQwM1Mva1YoyT0eNVbFWeq9YLNLW2kxmIqt3795NLBajxpkC1E1MLS0tvPe972XBggW0trbieR69vb3185bLZebMmcNb3vIWzj1vPXffew/f+MY3uO/+n/CqDdfq7ilzXrlaIRKLhtFZU9h98KD+8d13UfVc3vfe93LF5ZeSy+UYGxtjzZo1x13D/v3767uFwcFB1p6C3eBvEr9VAh2mCXU/qzFPbgN8OaACKBUrBGhMfr0ZoC8GGsjksoxMjOOaqbAGqZRQo1jVCq0C8Fw6e7pIzbIG7d65ExEoDCmIRCLoIAAEUki0VlTKZZRhYRiCoJAjqjVR08AyJMI28GVY3qLoukQMCxVobAy0r7GUYt/WF1iw4TJN9MTMkydDjff6WAyPjmjDMGhrmX0BzUxO6JamE5NQjU9ktOd5x9V1rJk3akUtLrngQtHV1aW/8Y1vsH//fkZGRli6YGG9rdaaSqVCtVqFJLS3txOPxzl48GC94PThw4cplUrMnz+/TokrpSSfz6OU4swzz2TV8uN5b2q84b7vs2TJElYtXyEKhYJ+6qmn+NnPfsaH/+KDABw8eBAIBfbrXvc60qnjbf2ThaKuuKEJqauriwvOPb5s3okwmZnQfX19VKtVIpEIAwMDHBkc1t1zjs5dEARUKhUcx2FoaIjR0VHmz5vL0NAQQ0NDJJNJTNOs0+x6nke5XGZiYoJly5Zx3vpzZx1PrfpSV083l1xwvkg1pfWXv/xlxsfHOXLkCN1T5jzbtsnlcjMqVz3++ONMTk6ydu1aXn/TG+g8CSnZ1m0v6PHxcZqawrqpu3fv5rprN5yo+WmB36ool1MNAdjSCIsJIWgi9hu3r026RZ7d+FzoLFIBYf69Bj/klcEQKM/FMS3OOnMlxxKnuqNH9I5tL+DIULuv8VF7nkcQBEgZZqAaQhKRJnHLJG4b4HsU81k8r4ob+Bi2hRONooUkCDSWNMAPiGjB7k2boXLiakInw1/+5V/qQ4cO8W//9m/cfPPNeseunRrgv27/b33ddddx8cUXc/Pv36Kf3fjz+jZt/SvO01/9+tf0pz/9aT7y0f9vxvbtQN9B/d7b3qeXrViu169fz80338z37/zBccUTaqXlasJnyRkLxXnnnUcul2NwZLjeVgkI0LiBT3dbyOLoxKIsXLKY4bFRMtlJADa/sJV0Os3cuXNpnjLNpOMJkUgk6gWcZ0Ot/F7NtgyQTjeTTjeTyUzW23legGnaRCIxTvSaNiXiIhqNYjr2SUv6zYZSqcT+/ftZuXIlixcvRUqTjRtnlnwTwiASiWEYFiMjYwwMhDzzu3btIZFIYdsRbDukGA4hiceTxGIJhDixchQEGq0Fth3ubFavWCGqFQ+0pFQ8SqlbrXhoJYhGjgr0Rx5+jEQ8xbnnrD+pMAfYt28fra2tLFiwgObm5voieTrjlAt0PXULlJxG6o+cqlQkMLQHQQmCLPgZjTcRftxxjTuh8aYqnXjZ8Hglo/Emda0q0nQIOTMxB0J+dKlCTTgQEk8FIb/JL6i1/GJQYzxUWARC1GuZTpVqmupB4UtB2bAYAp3xwjTPEdB9oLcPZ7jvmU1UtYFSU/zwnoKpMELbEhi6QtKBVUvmH7enCAplRvoOY5thRqshJRE7gmVYCCGRpoWSEh9FRflUXA8/0HiGQNsm0UQcU2uEF6DKZQwBinBhCYIAU0gOH+yD6onLiZ0Iw8PDesOGDbS2tnLVVVfx1re/jTlz5vD8ls36O9/5Dpdeeil/8Rd/QTaf56GHHiJbDKvLTExMcO+999LX18e6detmnDMWi3HZZZfxxS/8B//+7/9OV2c3jzzyCPsP9NXvfDQaxXV9isUirnt03M3NzUxO5sjlcvVjvq+mqssrJipFDaGmOG/eAorFIsViWGpux45dmKZJU0tz/bfZYkEbhoHrulSrVSYLeV27hhqmL6y+r6b69OvVh2pYsmQJhmFgWRbf+ta3TjinAYJSqcRELgvARPHFVc0pVcoMDY/SM3ce7V2dxJIJdu3dM6ONG/i4gQ+GxA38eh/PPrcRw7YI0CGXkBk+hYYdcqtXPHcGL/hkYWYSnjANDMOotxkan9S2beO6bt18BRCPx4lGo2Sz2fqxfD6PYRgzCpucCM9u3IjlOMxbsIC2trb/EQL9lJpctAGBDulbpQxDmwJlgGkTAMIwSVga9j4HRhyi6SnuEgGExZ31VGE5iUJoH/wKvqfRcxci0t3aFEdDr6TwMbRCBpqa5LN0ABq0FPhC4knJ7iP9xFvbMLWl/UqAbTr1LbqrPeKJGMViHlOYKF+RcJKUskUuXjx7BXNXObiGBEOhXIg6UXxX41WLCFthJKI8c2gYy06QqHpYptTD1RLP9+3h8c1b2DHpkQ8cHCuCcjUq0GDFqZZd7KBKa8wgFZRYPT95nEP0wKbNxFwPr+qGtkfPA22gfDAjEdxqQGCZlKXAQxE1opS8KkY8SqVQgHIVRwtk1UObkrLywBJUgyrCMXFdl2K5yr69++htadK2/eJDDjs7O0VnZyexRFyfuWolr7r6GgHw7MaN2o5E+MhHP0pLKi2UFPon995H/+FDnLVsBblCgXkLFvCud72LM3pnhs91tneIm17/hvq/I05C//3f/21dWAIEboDUEsd0iE/T9tLpZgxpUZmmFRraoFwoY0ub5khYQKEz1Szmds3VXsVjfHgcgH279tHZOYfe3qNONi0kvtJkJrN86StfpbOzE8/zuPDCC/WGK6+cWuzDAoWJVJqqFyY0HDzUT75UZMWqlfVzLV+2SKw//xX6rrvu4tvfvYOyW9VXXnklq5aHtM3ZYkWn4xHhBwGGafPYY09QKVZ04Pl0d3bpN7z+9TSdJBQyUyiw5+B+Lr3iSpqamnj0scfY9PzzM9oorTFMk0QySXt7O1u2bmU4c53euWsXCMG8+fPDhWiqSpHn+1Q8l3giwe1f+TIP/OynWitFz9y53HrL22ac13TsOsXEM888g23bJBIJmpuPLpC1neX0hW5iYoJyOYwM+kXYtHkLpu1w4cWXkM8XefKxx3/hb37Xccpt6KpeHFoCAVJoAs9DIPDdPLmhA+x/9C6yBRcZieKpsAapnqrUMr3ikaV8IkFAEGui9YJr6DyzFaaVV/Q8f6pCkSQQYEyjsQqEwJcwVBjip889yHM7N4bthYFpmiitCZjid5Ea4SsSsQRBSSMDQUQ4xG929NrWlTNeGs2UQj5VIQkF2vNQno9t2xgRmChkuH/jJjY9vw1RcgkIyAufca9EplShaEURZiwkDPMUTiqNEi5+uYotFMWxId58w6tIzjK/e7dsRVRdTFOitAqvBY1hORQ9H1cp0nM66Fg0H8+QaC/AVT5mMoLpuySLLnuf3kgsCDAMC60VWgsM08T3PCKGSTVQbP/5RhZdfOXLYqIaGxtj/vz51MIHV61axXe/+13y+TwAbR3trFix4jhhPhvC6vGRGdVwWprTwjRNbVnOjGLOhmGhggBDWtOOGVimc1wptZ6eHtKpcNs+ND6pR0ZG6O3tJZVK1ds0xWIiCAK9a9cu+vv7yefzpFIphBBsuPLK+vjK5TL9/f18+ctf5ita6o0bN1Iul7n22mtn9HnrrbcyOjrKs88+yxe/+EV+/vOf8+53v1tfcsF5Ih2PCIBUKkWpUmbjxo08+9TTlApFLr/kUs5ffx5NTSs5EQ709xGgMWyL1eespVStMDQ6AsBkxdVNEVvUtPBEOkUkHqN/4DBlt8r2XTvpmddLPJWkcGQw9DUATU1NpNJphoaG+NnDDzMxMYHv+2zYsIFrr71Wz+0MlS0pJcMjI9x3333s27dPP/nkkxiGQTKZZMmC3vo91lqHRTimlWr0PI9UKnXSws4AI/mc7h84TCwWY/nKM3nwwQcpu1U2b3lBrz571W/ctPrrwikW6CZoE6XDAhJSaxxDU63mcaIxqmg8HZA5uI1swcVwHAJd18qBWum4EEJLMlWJn+rCWTxJl6dnCHTTiqIxp36vUUIihERIEyUEvlRUrBwHs5OoYQXIqbqNgorroqUiErEpVStEDIuIFUGVNUHFJ2rF0em3M8qIbqej/oAoQOBhag9Xm8SsCDJQ+IGP1BYIgVKCA0cG2VEuYybTFHSADtxQ1zZspB1B+xbaV+BEqVaLoMogAiIS2hMJLlu9hjiQBT1dS3/umadRnothSrSvCSSUPQ/LNihrhUrYrLrqYi56/WsIUjHiTa3kq1U8K8Aolans7WPz/j24E3kc7Yc1X6cIukSgsWSA8jy23f8QN/w/H3xZnoojR47MEIymaVIqleoOcsuySCZnW76Oov/QgN65cyd79+4Fwvs2HaVSYcq3fNQUUCzmCQIP0zoqvP3ARRMWI6mVtgOY091JU3OKHTu3MTY+QmZijBVnLmPevKPRJIPj49qyLM455xxuuukm5s6di9Z6Rh3RSCRCMpmkVCrxk5/8hMDzKZfL/K//9Ro2bHjVjDGvXLZYfPrTn9RPPvkk//Vf/8XDD/+UbHaClbffrltSSQEwOTlJOp3mda95Leeduw6hoa25hVVnrzyp0Nq3b18o7JYuZtmSRaB8ivks2/fu1WdOVUoKvCpCBzSnk3R3dfD000+zZ9cOCrlJllxyEYVCgVQ6ge2EYmQym6FYytPS2sRtt72XefPmkUgkiMfj1IQ5gNI+2dwEm57fyMOP/JRUKkV7Ryvv/8CfzRijCAmNCNTRe2aYAterUKme3IdTc1ovXryYM844g97eXhzH4fHHH2f12atO+tvfZZxSgS70Uf1c6LCsWuC7KK+McCy0HxB1IrjVInFTYE6FGx1FWHVITAl1jUU1EqMoFaahsYyZlyNF+G8x1VrCVNWgMEsUQ+NrD2kEiKiJIQ2EIQh8HykVpm2hpcIAhAmFagHHtLCSDuVSEc+oEOAzQUY3E0Z8aEDiInFCIah1GGUhzXBX4GswIyjbxjCj5KVFmJJJGK4ZaJQSYFhgmOFxzwPt4+Dj+C7XXXIBC1MpojDT5HKoT48e6CMZKGwNRhBgGJJAChQBwjQoBgFzly0ntnYVRMJokjRQIasjAJEkQSKOVfGwAoXrV7GQBL6LLU2CwMMJ4MjOHdC3RzP/+MpNvyyUUvWK6kA907FW/NifylydDROTOf0P//AP/PCHP2Tp0qXkcjlisdgMG242F9q2pZQzSoa5rothGDNqetZ4awBqwhygpaWF5uZmjhw5wsGDBzEMg46ODtpSR80atm1jGAbxeJyzzjqLV6xde9zchLkAipaWFi699FJ27djJ/v37uemmm+hsPT5qqKOlWbzm+utwHEf/0z/9Exs3bmTv3r2cd85aJopFbRgG+WyO3t5eXrNhw4u+F7t37MSyLHbu3Mn4+DjRaBStNQcPHuTMxYuBcLdSy/ZcsGAB9957L/fddx9tbW3Mnz+fLVu21EsJQrhY1Wgt1qxZw8XnnReah8ozbeiGYdRK3jE2NsbmzZt529veVg/tPHaupmePJxIJBgcHZ/g9ZsO2bdsQQuC6Lt/97ncZGBggmUyyffv2FztFv5M4dU7RIKtNrTBV+DG0QgCm5WDYMTBsXD9AaQGBjyHBr5YgcJF+BcMvYfllLL+I5Rdx/DxSFfBUkQpFlOGDPfNyKl6F0GrpY2kfU7vYgcYOFE6gcHwJgYHQMXQQoVrUlPMBXlmAjiCIUCkJvKqJChz8igQdxTTi+J6BV5UYMMMxKWCKFlGhBRSrZSpKEVg22oqilQlGhLwv8ZQDBQHlKLgR8CPgWeBJCARIAX4VKxYhGrFIC83S1iZuWP8KltmIpmPs54MbXyBVCmgNJJGKS9T3sVyPGALLVaQjMaQ0Sbe3gR9QKo3V35QIaQFpgZOiLd2O5UlkVREJDGxkaCu1BK6qoKWPDiqM7tz2sjwaqURiRhijZVnYtl0/JqWc4Sybjq1bt7Jn/z7++V//he9/7w7xN3/7f/FUgBObRlhvSOxohEK5NINqeGxsDMdxSMaPbt9NGdbZlMc4yVuamunq6CSfzfHMU0+TiMU5Y/6CGW28qotbqaL8AMeaPeqkkMtTKhRpSqV5z7vezSWXXEIQBOzYseOkc3TtVVeKJUuWEI1GefrppwFojsdFempnc6L5ORF27tyJ8ny+/OUv8+///u8AZLNZxsfH621qZicpJT09PTiOw6OPPoppmixevBitQyVKB+ECGHg+lmHiWDZR5+h4pi+MtXatzS28+rrredNNb2Rudw+PPvzIce3cShU5FZFVQ0dbOxJBbjLLyfDCCy+glGL79u38y7/8Cw8//DClUmnWePvTCadOoGsfiY+hQ0elocMIFKUlwomghIlh2gjTQloh34ZSPgYaKTSGACkCTBFgosKPCLCEiwzKGEEFgsqMLqUBAh9JAMJDi4BA+gQyCG3cQmFgYUoHQ4fmIFNEccwYhrbwKgG2GcEQFqawiUVTmEYEz1VIYZOKpLCwcPRRkR7uPkInrhKAbeMZYek4HyNsYcVQvkHVA9tJYQsLoc1QvTckWAYIBX4FDE2Qy6AzYyxrbeb1l13KouZZqmtk83rb08+SNGwiCFTghSF4U3zvrusSaEGipYWW7rmQ6BCx2Cx8LIbFwsXLkIaFIW2EDjNUldZ4MlxrfAJilsO25557WR6NSCTCkSNHaXmDICCbzdbjj33fPyFp2849u+nq6mLt2rVAGEdumiaFQqHexvf9Oud9TUM/eDg00bS1tc0w99Q0+WPDDud2dYq5c+dSKpV49NFHMQyDRYsWzWjT1dYqLMvCsqwThi0mEglaW1upVCpIKVm9ejVNTU184xvfOOkcZXJh9IrWesZuJpvNIoWA4MWXRewbOKLHR8dobW3lyiuvZMOGDXR3d6O1Zv/+/fV2tTmXUtLR0UF7ezsjIyNUKhUWL16MaYZO8tqc1vILPM+bEZlyLGzbplwu43kel156Ka7rsn//fh742cMzNHnLssJi7dN2Z2eddRbFYpFdu3aRLZZOGNFz8OBBlFKsX7+eDRs2cMUVV2BYJi/s2E5m4viIuNMFpzBsUWPoAEGAwAcUSkChUqXkQcFV+NLGUwJPCXwNGDY+xhRnOfjaCD9IfCQoTcoUpAlIBR5UZgp0U4aCXAkPz/BxTY+K5VGyfUp2QNVUBDqov/C2ZRB1wqQHlA5fEh2ADvADF6V8KpUSpXIRrQOCqk8UG0ccTYAyIPQTIMKEoIgFtnFUjVeAGQXDwbQcfN/F9UtovwRUwfbA8cEJwKiSFFWadIX1PZ28dv06rl27jG5zlhjLUpld23cQBB6+hKKpKdsCN2JRtQxcQzJRKZNsayeInCRm2TboXLKISdejEPh4QoSFvKdK1BFxUAi0r9m9ffdLeySm0N3dTSaTYWxyQgMc2LefZDJZF7Re1cV3Z6e4TKVSVD2XfLHA8MSENiwTaRq4/lGTizAkwpA40Qh79u3lmeef13fdczfDoyOsWLGC7u7uetva9l4pdZzA6OnpwTAMBgYGsCyLJUuWzBhLtljSteSaAwcO8MLOXXpfX7/evf+AnsiH4Yu5XI5SqYTneUgpWbZ4CSuWLuNwXz+PPvZEvb/BoRH9zLMbdU34bH5uEwf37cevupy7Zm29T1NI0uk0w8PDbNq2Te8/0Kd379mnR0fHTyi0tmzZglKKlSvO5P/+zSf4xEc/Kl593fVEnQh9Bw7W2xlCogOFRNDdNYfO9g4sw+SM+QtoSqXru5iaQK+ZSKSUjIyMcODQYb1l+w69edv24/IClFJ138hFF11ELper7zxqONbcAnDRRReRSqV4/vnnuffeezkyOKz3H+jTjz/xlB7JhM/P4ZERPTg4iFKK973vffz9xz4uPvzhD9PT04PWmt379p5oan7ncUpt6IGQ+MKgKm201HhIrHgEhSQIFJYVhjK5foAWEmnaaKWmBKRCoghEqP3WVqKgqlCWxlASxMz1qVquYCqwlCBQEl+CEhKJDOPTtUTYJiDqyQ7KrdY1Qjvq4AUuhm2ipUBpwNA4VhRL2FSVj8Px2axCg0QDPnhlMFRoDzd8qFYRnkR7ZUzLDP3EQuEbAYEIwPdA+ZgKokFAwnU5Z/4C3nrN1axf1MwZxgkC5ksVxoZHqLgepqVxLQPfNvACHy0N7GSKwDDpnjcf24nNegoALIO27m5cQyCMKJ5fAS2RTpRSpUwsEiPwXPyKS2ZwHIbHNJ0vjXlx+fLlfONb3+KOO+5g6dKl+qGHHmL58uW0tLQAocCoJeEci0QiQX9/Pz//+c9Zv3493/zmN+vp8DVorfH9MA79O9/5Dvfffz/79u2jWq2ycuVKlpyx4LjMUsMwSMdnJpq1tbWRSCSoVCrE43FWLptJBJWOx4RSSh86dIivfvWrdS29s7OTP/zDP2TdmtWk02lMM2SwDIKAM5cuET09PToSifC1r32NSy6+EIBNmzZx++23k0gkEELooaEhDhw4wIUXXsjKM48SVRmGQaFQ4Ac/+AGPP/oY9pQf6eqrruI973nXrHO2bctWfN9n7ty5NCXC0MwLL7yQT33qU0xMTLBjz169YsliUSgU6gK1ra2NZDKJ4zisX7++HlJoWdYM01g8Hiefz4cRPF/5CrFYDCklb3nLW/Rrrr9OQJg7UIvXb0rExbp16/SPfvQjnnzySfYcOKhr90PK0NQ3PaJl/do1Ys2aNfrxxx/n85//PPfedTee5zGRy/Lnf/7ndFx8EePj4+RyOWzbpre3l8lqRdd2NW1tbTz//POcv+5Xp674bcapE+jCpKBtSlaMUjZDe3sHXrmIo73QBCMI8/AR2LY9VfcShJChcA9jDxB6qjyaJkyQkSZVI0EFC+RMzTPqxJGeQYIEqlzCMCWmsFCBxNQGmOAZmgoKacopR61EmyFdbFkrtClQSlMq5mlrbsM3NG4gKJRLaMdhNghcdMXHsiW+oYAAQ4N0JcJUGF4F09IIrVDaR2ifqK8xhAbXxVYBbdEkc5IJ3nj1q1g5by7L2kU9cWk27Hn6OQwMPK3xLBvfgjIeWlrYhoWnJJPZAm3NHVjp9hPfp1haNDU16XRrG+WhcSLSwvNDsi7TSlCtalA2zbEUlckqu7fvZGnnxSc+3zGYzGW148wMH1y1ahVXXH45X/vKVxgcHmb16tXceuutxKOhUA6C4IS0yitXLGPRGQv4649/DMMwuOGGG3Ask/xURieA8j2ijk2lVKT/4AEOTjklb37XrfzeG2+acb5yMY/QAfGow2Quq6dT0HZ1tBGPOgwdOcyF589OfmUgyOXy7Ny2vW7mmRgbJz9l862WyvhVl5gToVoK5+AV56/n3vvu5vnNzzEweET3zOkW8US0HglSKBSIRCJceeWV/MEf/MGM/nK5HG3NLRzYt5/JzASB66G1ZtXKE4csbtq0Cce0aGtuqR/r7e0hFoswPj7K0NARVixZjJRhpSvHsQDF0qWLeeKJxzjvvHUh6ZvyQfl41fA6JArfreBYBof7D1KjrW1qamJ0ePDomCczxCI2qHAhuPjC8/HdCmMjQxzYt4clU8RvhgjfCaFnmq/e+8d/SKVU4Pnnn2eg/xCu63LWmtV1E9H27duJR6IUc3nO6AppeXGgs7NTDw4cOa0do+JU8Y9Xqlndt/kR9j78TfzJwxh2lFIuR9IEQx9NHZ5i/g4zSvUxFiGhjjtWVT7EWjnrijex6PwNEDnKlvjItof1577+WSb9SYpBBWGEtnBVK/ZgScrSRYkw6kVqeTSVVWiUUHiBSywRxXc9pDQpTBSxjQhN8TQf/8DHWJlYTJNxlGdjTxX94X/+V3ZOTpJF4WsDMEOucTVVWg4V+g+EwnQEQmsSpklbIk1vaxtL5vayeskyls5rwvahJ3LyNNZgYkI/+e07uesrX2W0rw/T0nhmgLAEJibKDbC1STTVwut+/x1ccMvbIX3iikuZZ57R//nXf8fgzj2IQIUvrjDAkCgVrruWZeOnYrz+r97P2iuvINX04nl3akJr+rFsPqcHBwfJF4uk02mWLlxU/35/f59eeBLa09GJjN67dy/z5s2jxkXedgzny0Q+p13XxbbterJKe/PsXDQH+/tOSLN6ZGhQ17TT2dqMjU/o2m6iRjnQ2jIz+arGGT6dRzybz+lcLkdvz1wxPpHRrVNje37LZu37fj07cjpPew3j+bwOPB/LsmhOJsTEZE6fjF99YjKntdYzSL4ABoaHdE9n18yxTk7ocrlM79T9Ghob1V3TuN0nspN6Ohf5WGZcSylpaWoWo+NjumZamc7Bk83ndLVancERDyEXjxCi3jabD8d5Il73Z37+rC4Wyixfvpw5XR0z2gyOjmmkYE7rNK72yayukZG1pk88P7/LOGUCHcB1M9ouHATLg3gTeDoUFKompOWUDjr177ojbLoQn/63B2YJyi5Eu0B2ioyvdYsZ/jCrijot4yLDqPYJHaASE4Gaik4XVFFoQBBGNqSnTCg5shp0GL+OxtMujojSNPX9YH5Yz0l2zv7SFwLtRo2Qe4XwkqxjRq7C0VOaOh4D4kDTSbTw2ZDF1Wns8DeZSU1NeFRGNMoP4y2xwjkulMGyoeVFkGodGdB09wgmJzVahRE36amXcjKr+SUEeAO/GWRzBX0sqdfkZE7XMkjHM5P62MWmgd9tnFKBDoAe1eCCiAK/GlvfDATDWqMRRtfv5IOZCRkRjkvhf9lwilgrG2iggd88Tr1AP82QpaJdXNr51bZwmSkjz8ns4w000EADLwYNgf4bxgSubq6ZTI7BGEXdRrwh6BtooIEXhdOWD10z+TuxUp1ImAP8ImE+qfm1X2M2zAhooIEGfgfQ0NAbmBXZoKrThtPYHTTQwO8QGgK9gQYaaOA0wWlrcmmggQYa+J+GhkBvoIEGGjhN0BDoDTTQQAOnCRoCvYEGGmjgNEFDoDfQQAMNnCZoCPQGGmiggdMEDYHeQAMNNHCaoCHQG2iggQZOEzQEegMNNNDAaYL/HzA4bY7JoovhAAAAAElFTkSuQmCC";


const SECTIONS = [
  {
    id: "intro",
    title: "Welcome",
  },
  {
    id: "location",
    title: "Location",
    icon: "📍",
    questions: [
      {
        id: "q1",
        prompt: "I want to attend college…",
        allowMultiple: false,
        options: [
          {
            id: "1a",
            label: "Within driving distance of my home",
            desc: null,
            fitFactor: true,
            searchTerms: ["regional colleges"],
            hasTextInput: true,
            textInputLabel: "Where's home?",
          },
          {
            id: "1b",
            label: "In a certain region of the US",
            desc: null,
            fitFactor: true,
            searchTerms: ["[your preferred region]"],
            hasTextInput: true,
            textInputLabel: "Which region(s) interest you?",
          },
          {
            id: "1c",
            label: "I'm open to anywhere!",
            desc: null,
            fitFactor: false,
            searchTerms: [],
          },
        ],
      },
      {
        id: "q2",
        prompt: "I want to attend college…",
        allowMultiple: true,
        multipleNote: "Select all that appeal to you.",
        options: [
          {
            id: "2a",
            label: "In a large city",
            desc: null,
            fitFactor: true,
            searchTerms: ["urban"],
          },
          {
            id: "2b",
            label: "In a suburb with access to a city",
            desc: null,
            fitFactor: true,
            searchTerms: ["suburban"],
          },
          {
            id: "2c",
            label: "In a natural setting with a strong campus community",
            desc: null,
            fitFactor: true,
            searchTerms: ["rural"],
          },
        ],
      },
    ],
    otherPrompt: "Anything else about location that matters to you?",
  },
  {
    id: "size",
    title: "Campus Size",
    icon: "🏛️",
    subtitle: "We're looking at undergraduate student population only — not grad or professional students.",
    questions: [
      {
        id: "q3",
        prompt: "I would like to go to college with…",
        allowMultiple: true,
        multipleNote: "Select all that appeal to you.",
        options: [
          {
            id: "3a",
            label: "A true community where everyone knows your name",
            desc: null,
            fitFactor: true,
            searchTerms: ["small college / liberal arts"],
          },
          {
            id: "3b",
            label: "A mid-size school with a sense of community",
            desc: null,
            fitFactor: true,
            searchTerms: ["medium-sized university"],
          },
          {
            id: "3c",
            label: "A big school where every class is filled with new faces",
            desc: null,
            fitFactor: true,
            searchTerms: ["large university"],
          },
        ],
      },
    ],
  },
  {
    id: "curriculum",
    title: "Curriculum",
    icon: "📚",
    questions: [
      {
        id: "q4",
        prompt: "I would like to be on a campus where…",
        allowMultiple: false,
        options: [
          {
            id: "4a",
            label: "I can take any classes I want!",
            desc: null,
            fitFactor: true,
            searchTerms: ["open curriculum"],
          },
          {
            id: "4b",
            label: "I can pick my classes, but I have to make sure they're well-rounded (math, science, humanities, social science)",
            desc: null,
            fitFactor: true,
            searchTerms: ["distribution requirements"],
          },
          {
            id: "4c",
            label: "There are specific classes everyone takes — creating a shared experience for all students",
            desc: null,
            fitFactor: true,
            searchTerms: ["core curriculum"],
          },
        ],
      },
      {
        id: "q5",
        prompt: "I would like to be on a campus where…",
        allowMultiple: false,
        options: [
          {
            id: "5a",
            label: "I can explore my options for majors — I'm undecided!",
            desc: null,
            fitFactor: true,
            searchTerms: ["liberal arts"],
          },
          {
            id: "5b",
            label: "I can study my current passion from day 1",
            desc: null,
            fitFactor: true,
            searchTerms: ["specific major programs"],
            hasTextInput: true,
            textInputLabel: "What field(s) are you interested in?",
          },
        ],
      },
    ],
    otherPrompt: "Anything else about academics or curriculum that matters to you?",
  },
  {
    id: "community",
    title: "Campus Community",
    icon: "🤝",
    questions: [
      {
        id: "q6",
        prompt: "I would like to be on a campus where…",
        allowMultiple: true,
        multipleNote: "Select all that resonate with you.",
        options: [
          {
            id: "6a",
            label: "Sports are a big part of campus life",
            desc: null,
            fitFactor: true,
            searchTerms: ["D1 athletics"],
          },
          {
            id: "6b",
            label: "Students are quirky, artsy, and intellectual",
            desc: null,
            fitFactor: true,
            searchTerms: ["artsy / progressive"],
          },
          {
            id: "6c",
            label: "Students are pre-professional and career-focused",
            desc: null,
            fitFactor: true,
            searchTerms: ["pre-professional"],
          },
          {
            id: "6d",
            label: "Students are committed to activism and social justice",
            desc: null,
            fitFactor: true,
            searchTerms: ["activist / social justice"],
          },
        ],
      },
      {
        id: "q7",
        prompt: "Cultural, religious, or affinity centers and housing options are important to me.",
        skipImportance: true,
        allowMultiple: false,
        options: [
          {
            id: "7a",
            label: "Yes — this matters to me",
            desc: null,
            fitFactor: true,
            searchTerms: ["affinity centers and housing"],
            hasTextInput: true,
            textInputLabel: "Any specific communities or identities you'd like supported?",
          },
          {
            id: "7b",
            label: "I'd like these options, but it's not a deal-breaker",
            fitFactor: false,
            searchTerms: [],
          },
          {
            id: "7c",
            label: "No strong preference",
            fitFactor: false,
            searchTerms: [],
          },
        ],
      },
    ],
    otherPrompt: "Anything else about campus culture or community that matters to you?",
  },
  {
    id: "academic_style",
    title: "Learning Style",
    icon: "🎓",
    questions: [
      {
        id: "q10",
        prompt: "Individual attention from professors is important to me.",
        skipImportance: true,
        allowMultiple: false,
        options: [
          {
            id: "10a",
            label: "Disagree — I'm self-directed",
            desc: null,
            fitFactor: false,
            searchTerms: [],
          },
          {
            id: "10b",
            label: "Neutral",
            desc: null,
            fitFactor: false,
            searchTerms: [],
          },
          {
            id: "10c",
            label: "Agree",
            desc: null,
            fitFactor: true,
            searchTerms: ["student-to-professor ratio under 20:1"],
          },
          {
            id: "10d",
            label: "Strongly agree",
            desc: null,
            fitFactor: true,
            searchTerms: ["student-to-professor ratio under 12:1"],
          },
        ],
      },
      {
        id: "q11",
        prompt: "I learn best when I can speak to my peers in class and ask the professor questions.",
        skipImportance: true,
        allowMultiple: false,
        options: [
          {
            id: "11a",
            label: "Disagree — I prefer lectures",
            desc: null,
            fitFactor: true,
            searchTerms: ["lecture-based teaching"],
          },
          {
            id: "11b",
            label: "Neutral",
            desc: null,
            fitFactor: false,
            searchTerms: [],
          },
          {
            id: "11c",
            label: "Agree — I want discussion and interaction",
            desc: null,
            fitFactor: true,
            searchTerms: ["seminars / discussion-based classes"],
          },
        ],
      },
    ],
  },
  {
    id: "reflect",
    title: "Anything Else?",
  },
  {
    id: "pick_top3",
    title: "Your Priorities",
  },
  {
    id: "report",
    title: "Your Results",
  },
];

const IMPORTANCE_LABELS = {
  3: "Very important",
  2: "Somewhat important",
  1: "Nice to have",
};

function QuestionCard({ question, answers, setAnswers, importanceRatings, setImportanceRatings, textInputs, setTextInputs }) {
  const selected = answers[question.id] || [];
  const isMulti = question.allowMultiple;

  const handleSelect = (optionId) => {
    if (isMulti) {
      setAnswers((prev) => {
        const current = prev[question.id] || [];
        return {
          ...prev,
          [question.id]: current.includes(optionId)
            ? current.filter((id) => id !== optionId)
            : [...current, optionId],
        };
      });
    } else {
      setAnswers((prev) => ({
        ...prev,
        [question.id]: [optionId],
      }));
    }
  };

  const handleImportance = (optionId, value) => {
    setImportanceRatings((prev) => ({ ...prev, [optionId]: value }));
  };

  const handleTextInput = (optionId, value) => {
    setTextInputs((prev) => ({ ...prev, [optionId]: value }));
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{
        fontFamily: "'Source Serif 4', Georgia, serif",
        fontSize: 19,
        fontWeight: 600,
        color: "var(--text)",
        marginBottom: 4,
        lineHeight: 1.4,
      }}>
        {question.prompt}
      </h3>
      {isMulti && question.multipleNote && (
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: "var(--muted)",
          marginBottom: 14,
          marginTop: 2,
          fontStyle: "italic",
        }}>
          {question.multipleNote}
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        {question.options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const showImportance = isSelected && opt.fitFactor && !question.skipImportance && (!isMulti || selected.length === 1);
          return (
            <div key={opt.id}>
              <button
                onClick={() => handleSelect(opt.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: isSelected ? "var(--selected-bg)" : "var(--card-bg)",
                  border: isSelected ? "2px solid var(--accent)" : "2px solid var(--border)",
                  borderRadius: 12,
                  padding: "14px 18px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{
                    width: 22,
                    height: 22,
                    minWidth: 22,
                    borderRadius: isMulti ? 5 : 11,
                    border: isSelected ? "2px solid var(--accent)" : "2px solid var(--muted-border)",
                    background: isSelected ? "var(--accent)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 1,
                    transition: "all 0.2s ease",
                  }}>
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "var(--text)",
                      lineHeight: 1.4,
                    }}>
                      {opt.label}
                    </div>
                    {opt.desc && (
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        color: "var(--muted)",
                        marginTop: 4,
                        lineHeight: 1.55,
                      }}>
                        {opt.desc}
                      </div>
                    )}
                  </div>
                </div>
              </button>

              {showImportance && (
                <div style={{
                  marginTop: 8,
                  marginLeft: 36,
                  padding: "10px 16px",
                  background: "var(--importance-bg)",
                  borderRadius: 10,
                  animation: "fadeSlideIn 0.25s ease",
                }}>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--accent-dark)",
                    marginBottom: 8,
                  }}>
                    How important is this to you?
                  </p>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[1, 2, 3].map((val) => (
                      <button
                        key={val}
                        onClick={(e) => { e.stopPropagation(); handleImportance(opt.id, val); }}
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 12,
                          fontWeight: 500,
                          padding: "6px 14px",
                          borderRadius: 20,
                          border: importanceRatings[opt.id] === val
                            ? "2px solid var(--accent)"
                            : "2px solid var(--muted-border)",
                          background: importanceRatings[opt.id] === val
                            ? "var(--accent)"
                            : "transparent",
                          color: importanceRatings[opt.id] === val
                            ? "white"
                            : "var(--muted)",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {IMPORTANCE_LABELS[val]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isSelected && opt.hasTextInput && (
                <div style={{
                  marginTop: 8,
                  marginLeft: 36,
                  animation: "fadeSlideIn 0.25s ease",
                }}>
                  <input
                    type="text"
                    placeholder={opt.textInputLabel}
                    value={textInputs[opt.id] || ""}
                    onChange={(e) => handleTextInput(opt.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "2px solid var(--border)",
                      background: "var(--card-bg)",
                      color: "var(--text)",
                      outline: "none",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function collectAllTerms(answers, importanceRatings, textInputs) {
  const allTerms = [];
  const seenTerms = new Set();
  SECTIONS.forEach((section) => {
    if (!section.questions) return;
    section.questions.forEach((q) => {
      const selected = answers[q.id] || [];
      const isMulti = q.allowMultiple;
      const multiCount = selected.length;
      q.options.forEach((opt) => {
        if (selected.includes(opt.id) && opt.fitFactor) {
          const rawImportance = importanceRatings[opt.id];
          // Multi-select with >1 picked = "somewhat" unless explicitly rated
          const importance = (isMulti && multiCount > 1 && !rawImportance) ? 2 : (rawImportance || 2);
          const isMultiPick = isMulti && multiCount > 1;
          const userText = textInputs[opt.id]?.trim();

          if (opt.hasTextInput && userText) {
            // 7a (affinity) is processed by AI on the Reflect page
            if (opt.id === "7a") {
              const staticTerms = (opt.searchTerms || []).filter(t => !t.startsWith("["));
              if (staticTerms.length > 0) {
                const combined = staticTerms.join(" / ");
                if (!seenTerms.has(combined.toLowerCase())) {
                  seenTerms.add(combined.toLowerCase());
                  allTerms.push({ term: combined, maxImportance: importance, isMultiPick, source: opt.label, sectionTitle: section.title });
                }
              }
            } else {
              const dynamicTerm = opt.id === "1a"
                ? `driving distance from ${userText}`
                : opt.id === "1b"
                ? `colleges in the ${userText}`
                : opt.id === "5b"
                ? `${userText} major programs`
                : userText;
              if (!seenTerms.has(dynamicTerm.toLowerCase())) {
                seenTerms.add(dynamicTerm.toLowerCase());
                allTerms.push({ term: dynamicTerm, maxImportance: importance, isMultiPick, source: opt.label, sectionTitle: section.title });
              }
            }
          } else {
            const staticTerms = (opt.searchTerms || []).filter(t => !t.startsWith("["));
            if (staticTerms.length > 0) {
              const combined = staticTerms.join(" / ");
              if (!seenTerms.has(combined.toLowerCase())) {
                seenTerms.add(combined.toLowerCase());
                allTerms.push({ term: combined, maxImportance: importance, isMultiPick, source: opt.label, sectionTitle: section.title });
              }
            }
          }
        }
      });
    });
  });
  return allTerms;
}


function Reflect({ otherComments, textInputs, answers, importanceRatings, aiTerms, setAiTerms }) {
  const [extraText, setExtraText] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [autoProcessed, setAutoProcessed] = useState(false);
  const [autoCount, setAutoCount] = useState(0);

  // Auto-process earlier open responses on mount
  useEffect(() => {
    if (autoProcessed) return;
    const bits = [];
    // otherComments from section textareas
    Object.entries(otherComments || {}).forEach(([sectionId, text]) => {
      if (text.trim()) {
        const section = SECTIONS.find(s => s.id === sectionId);
        bits.push(`About ${section?.title || sectionId}: "${text.trim()}"`);
      }
    });
    // textInputs that are open-ended (affinity, etc.) - but not region/major which already generate terms
    const specialInputs = { "7a": "affinity/identity needs", "1a": "home location" };
    Object.entries(textInputs || {}).forEach(([optId, text]) => {
      if (text.trim() && specialInputs[optId]) {
        bits.push(`About ${specialInputs[optId]}: "${text.trim()}"`);
      }
    });
    if (bits.length === 0) { setAutoProcessed(true); return; }
    setLoading(true);
    (async () => {
      try {
        const response = await fetch("/api/suggest-terms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: bits.join("\n"), type: "comments" })
        });
        const parsed = await response.json();
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAiTerms(prev => [...prev, ...parsed.map(term => ({ term, maxImportance: 2, isMultiPick: false, source: "your comments", sectionTitle: "Other" }))]);
          setAutoCount(parsed.length);
        }
      } catch (err) { console.error("Auto-process error:", err); }
      setLoading(false);
      setAutoProcessed(true);
    })();
  }, [autoProcessed]);

  const handleGenerate = async () => {
    if (!extraText.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/suggest-terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: extraText.trim(), type: "extra" })
      });
      const parsed = await response.json();
      if (Array.isArray(parsed) && parsed.length > 0) {
        setAiTerms(prev => [...prev, ...parsed.map(term => ({ term, maxImportance: 2, isMultiPick: false, source: "your notes", sectionTitle: "Other" }))]);
        setAutoCount(prev => prev + parsed.length);
      }
    } catch (err) { console.error("AI error:", err); }
    setLoading(false);
    setDone(true);
  };

  return (
    <div style={{ animation: "fadeSlideIn 0.35s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>💭</div>
        <h2 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
          Anything else?
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "var(--muted)", maxWidth: 420, margin: "0 auto", lineHeight: 1.5 }}>
          Is there anything else you need in a college that we didn't ask about? Don't worry about using the "right" words — just tell us what matters to you.
        </p>
      </div>

      {autoCount > 0 && !loading && (
        <div style={{
          padding: "12px 16px", borderRadius: 10, background: "#E8F5E9",
          border: "1px solid var(--leda-green)", marginBottom: 16,
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--leda-green)", fontWeight: 600,
        }}>
          We generated {autoCount} search term{autoCount > 1 ? "s" : ""} from your responses — you'll see them when you pick your top 3!
        </div>
      )}

      <textarea
        value={extraText}
        onChange={(e) => setExtraText(e.target.value)}
        placeholder="e.g. I need to be somewhere my family can afford, I want to be near the ocean, I don't want to feel like just a number..."
        rows={4}
        style={{
          width: "100%", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          padding: "12px 16px", borderRadius: 12, border: "2px solid var(--border)",
          background: "var(--card-bg)", color: "var(--text)", outline: "none", resize: "vertical",
        }}
      />
      {!done && (
        <button onClick={handleGenerate} disabled={!extraText.trim() || loading} style={{
          marginTop: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
          padding: "8px 20px", borderRadius: 8, border: "none",
          background: (!extraText.trim() || loading) ? "var(--muted-border)" : "var(--leda-blue)",
          color: "white", cursor: (!extraText.trim() || loading) ? "default" : "pointer",
        }}>
          {loading ? "Thinking..." : "Suggest search terms from this"}
        </button>
      )}
      {done && aiTerms.length > 0 && (
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--leda-green)", fontWeight: 600, marginTop: 10 }}>
          Added new search terms based on what you wrote — you'll see them on the next page!
        </p>
      )}
      {loading && !done && (
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--muted)", marginTop: 10, fontStyle: "italic" }}>
          Reading your response...
        </p>
      )}
    </div>
  );
}

function PickTop3({ answers, importanceRatings, textInputs, top3Picks, setTop3Picks, aiTerms }) {
  const baseTerms = collectAllTerms(answers, importanceRatings, textInputs);
  const allTerms = [...baseTerms, ...aiTerms];

  const handleToggle = (term) => {
    setTop3Picks((prev) => {
      if (prev.includes(term)) return prev.filter((t) => t !== term);
      if (prev.length >= 3) return prev;
      return [...prev, term];
    });
  };

  if (allTerms.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>
        Go back and answer some questions first!
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeSlideIn 0.35s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>⭐</div>
        <h2 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
          Pick Your Top 3
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "var(--muted)", maxWidth: 420, margin: "0 auto", lineHeight: 1.5 }}>
          Choose the <strong>3 that matter most</strong> to you right now.
        </p>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: top3Picks.length === 3 ? "var(--leda-green)" : "var(--accent)", marginTop: 10 }}>
          {top3Picks.length} of 3 selected
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {allTerms.map((t) => {
          const isSelected = top3Picks.includes(t.term);
          const isDisabled = !isSelected && top3Picks.length >= 3;
          return (
            <button key={t.term} onClick={() => !isDisabled && handleToggle(t.term)} style={{
              textAlign: "left",
              background: isSelected ? "var(--selected-bg)" : "var(--card-bg)",
              border: isSelected ? "2px solid var(--accent)" : "2px solid var(--border)",
              borderRadius: 10, padding: "10px 12px",
              cursor: isDisabled ? "default" : "pointer",
              opacity: isDisabled ? 0.4 : 1,
              transition: "all 0.2s ease",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{
                width: 18, height: 18, minWidth: 18, borderRadius: 9,
                border: isSelected ? "2px solid var(--accent)" : "2px solid var(--muted-border)",
                background: isSelected ? "var(--accent)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {isSelected && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 13, color: "var(--text)", lineHeight: 1.3 }}>
                {t.term}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DownloadButton({ scholarName, topTerms, important, somewhatFiltered, niceFiltered, allOther, homeText }) {
  const [downloaded, setDownloaded] = useState(false);
  const handleDownload = () => {
    const name = scholarName || "My";
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const margin = 50;
    const pageW = doc.internal.pageSize.getWidth() - margin * 2;
    let y = 50;

    const checkPage = (needed) => {
      if (y + needed > doc.internal.pageSize.getHeight() - 50) {
        doc.addPage();
        y = 50;
      }
    };

    const addHeading = (text, size, color) => {
      checkPage(30);
      doc.setFontSize(size);
      doc.setTextColor(color || "#1a1a1a");
      doc.setFont("helvetica", "bold");
      doc.text(text, margin, y);
      y += size + 8;
    };

    const addText = (text, size, color, style) => {
      doc.setFontSize(size || 11);
      doc.setTextColor(color || "#374151");
      doc.setFont("helvetica", style || "normal");
      const lines = doc.splitTextToSize(text, pageW);
      checkPage(lines.length * (size || 11) + 8);
      doc.text(lines, margin, y);
      y += lines.length * ((size || 11) + 3) + 4;
    };

    const addTerm = (text) => {
      checkPage(24);
      doc.setFillColor("#F3F4F6");
      doc.roundedRect(margin, y - 10, pageW, 22, 4, 4, "F");
      doc.setFontSize(11);
      doc.setTextColor("#1a1a1a");
      doc.setFont("helvetica", "normal");
      doc.text(text, margin + 10, y + 4);
      y += 28;
    };

    // Header
    addHeading(`${name}'s College Fit Profile`, 20, "#1a1a1a");
    if (homeText) { addText(`Home: ${homeText}`, 10, "#6b7280"); }
    addText("Generated by LEDA College Fit Finder", 10, "#6b7280");
    y += 8;

    // Top 3
    if (topTerms.length > 0) {
      doc.setFillColor("#FEF2F2");
      doc.setDrawColor("#B5282C");
      const boxH = topTerms.length * 28 + 50;
      checkPage(boxH);
      doc.roundedRect(margin - 5, y - 5, pageW + 10, boxH, 6, 6, "FD");
      y += 10;
      addHeading("Your Top 3 Priorities", 14, "#8B1F22");
      topTerms.forEach((t, i) => {
        doc.setFontSize(12);
        doc.setTextColor("#B5282C");
        doc.setFont("helvetica", "bold");
        doc.text(`${i + 1}.`, margin + 5, y);
        doc.setTextColor("#1a1a1a");
        doc.setFont("helvetica", "normal");
        doc.text(t.term, margin + 25, y);
        y += 22;
      });
      y += 16;
    }

    // Notes
    if (allOther && allOther.length > 0) {
      addHeading("Your Additional Notes", 13, "#1a1a1a");
      allOther.forEach(([sectionId, comment]) => {
        const section = SECTIONS.find(s => s.id === sectionId);
        addText((section?.title || sectionId).toUpperCase(), 9, "#6b7280", "bold");
        addText(`"${comment}"`, 11, "#374151", "italic");
        y += 4;
      });
    }

    // Important
    if (important.length > 0) {
      y += 6;
      addHeading("Important", 13, "#8B1F22");
      important.forEach(t => addTerm(t.term));
    }

    // Somewhat
    if (somewhatFiltered.length > 0) {
      y += 6;
      addHeading("Somewhat Important", 13, "#E8852D");
      somewhatFiltered.forEach(t => addTerm(t.term));
    }

    // Nice to have
    if (niceFiltered.length > 0) {
      y += 6;
      addHeading("Nice to Have", 13, "#4E8542");
      niceFiltered.forEach(t => addTerm(t.term));
    }

    // Footer
    y += 20;
    checkPage(20);
    doc.setDrawColor("#E5E7EB");
    doc.line(margin, y, margin + pageW, y);
    y += 14;
    addText("Leadership Enterprise for a Diverse America (LEDA)", 9, "#9CA3AF");

    doc.save(`${name.replace(/\s+/g, "_")}_College_Fit_Profile.pdf`);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };
  return (
    <button onClick={handleDownload} style={{
      fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, padding: "12px 28px",
      borderRadius: 10, border: "none", background: downloaded ? "var(--leda-green)" : "var(--accent)",
      color: "white", cursor: "pointer", width: "100%", maxWidth: 320, transition: "all 0.2s ease",
    }}>
      {downloaded ? "Downloaded!" : "Download PDF"}
    </button>
  );
}

function EmailButton({ scholarName, topTerms, important, somewhatFiltered, niceFiltered, allOther }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!email || !email.includes("@")) { setError("Please enter a valid email"); return; }
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/send-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          scholarName: scholarName || "Scholar",
          topTerms: topTerms.map(t => t.term),
          important: important.map(t => t.term),
          somewhat: somewhatFiltered.map(t => t.term),
          niceToHave: niceFiltered.map(t => t.term),
          notes: allOther ? allOther.map(([sectionId, comment]) => {
            const section = SECTIONS.find(s => s.id === sectionId);
            return { section: section?.title || sectionId, comment };
          }) : [],
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSent(true);
      } else {
        setError("Could not send — try downloading the PDF instead.");
      }
    } catch (err) {
      setError("Could not send — try downloading the PDF instead.");
    }
    setSending(false);
  };

  if (sent) {
    return (
      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
        padding: "12px 28px", borderRadius: 10, background: "var(--leda-green)",
        color: "white", textAlign: "center", width: "100%", maxWidth: 320,
      }}>
        Sent to {email}!
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: 320 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            flex: 1, fontFamily: "'DM Sans', sans-serif", fontSize: 14,
            padding: "10px 14px", borderRadius: 10, border: "2px solid var(--border)",
            background: "var(--card-bg)", color: "var(--text)", outline: "none",
          }}
        />
        <button onClick={handleSend} disabled={sending} style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
          padding: "10px 16px", borderRadius: 10, border: "none",
          background: sending ? "var(--muted-border)" : "var(--leda-blue)",
          color: "white", cursor: sending ? "default" : "pointer", whiteSpace: "nowrap",
        }}>
          {sending ? "..." : "Email me"}
        </button>
      </div>
      {error && (
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "var(--accent)", marginTop: 6 }}>
          {error}
        </p>
      )}
    </div>
  );
}

function Report({ answers, importanceRatings, textInputs, otherComments, top3Picks, scholarName, aiTerms }) {
  const baseTerms = collectAllTerms(answers, importanceRatings, textInputs);
  const allTerms = [...baseTerms, ...aiTerms];
  const homeText = textInputs?.["1a"]?.trim();

  const topTerms = top3Picks.map(pick => allTerms.find(t => t.term === pick)).filter(Boolean);
  const remaining = allTerms.filter(t => !top3Picks.includes(t.term));

  const important = remaining.filter(t => t.maxImportance === 3);
  const somewhat = remaining.filter(t => (t.maxImportance === 2 || t.isMultiPick) && t.maxImportance !== 3);
  const niceToHave = remaining.filter(t => t.maxImportance === 1 && !t.isMultiPick);
  const somewhatFiltered = somewhat.filter(t => !important.find(i => i.term === t.term));
  const niceFiltered = niceToHave.filter(t => !important.find(i => i.term === t.term) && !somewhatFiltered.find(s => s.term === t.term));

  const allOther = Object.entries(otherComments).filter(([, v]) => v.trim());

  const tierHeader = (emoji, title, color) => (
    <h4 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 16, fontWeight: 700, color: color || "var(--text)", marginBottom: 10 }}>
      {emoji} {title}
    </h4>
  );
  const termPill = (t) => (
    <div key={t.term} style={{ padding: "10px 16px", background: "var(--card-bg)", borderRadius: 10, border: "1px solid var(--border)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14, color: "var(--text)" }}>
      {t.term}
    </div>
  );
  const tierBox = (bg, borderColor) => ({ background: bg, borderRadius: 14, padding: "20px 24px", marginBottom: 16, border: "1px solid " + borderColor });

  return (
    <div id="report-content" style={{ animation: "fadeSlideIn 0.4s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ marginBottom: 8 }}>
          <img src={LEDA_LOGO} alt="LEDA" style={{ height: 48, objectFit: "contain" }} />
        </div>
        <h2 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
          {scholarName ? `${scholarName}'s` : "Your"} College Fit Profile
        </h2>
        {homeText && (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "var(--muted)", marginBottom: 2 }}>
            Home: {homeText}
          </p>
        )}
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "var(--muted)", maxWidth: 500, margin: "0 auto", lineHeight: 1.5 }}>
          Here's a summary of what matters to you, organized by priority.
        </p>
      </div>

      {topTerms.length > 0 && (
        <div style={{ background: "var(--top-terms-bg)", borderRadius: 16, padding: "24px 28px", marginBottom: 24, border: "2px solid var(--accent)" }}>
          <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 18, fontWeight: 700, color: "var(--accent-dark)", marginBottom: 4 }}>
            🎯 Your Top 3 Priorities
          </h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
            Start your research here.{homeText ? ` Look for colleges within driving distance of ${homeText} if that matters to you.` : ""}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topTerms.map((t, i) => (
              <div key={t.term} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 24, fontWeight: 700, color: "var(--accent)", width: 30, textAlign: "center" }}>{i + 1}</span>
                <div style={{ flex: 1, background: "var(--card-bg)", padding: "10px 16px", borderRadius: 10 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, color: "var(--text)" }}>{t.term}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {allOther.length > 0 && (
        <div style={tierBox("var(--card-bg)", "var(--border)")}>
          {tierHeader("💬", "Your Additional Notes")}
          {allOther.map(([sectionId, comment]) => {
            const section = SECTIONS.find((s) => s.id === sectionId);
            return (
              <div key={sectionId} style={{ marginBottom: 10 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {section?.title || sectionId}
                </span>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "var(--text)", marginTop: 2, lineHeight: 1.5, fontStyle: "italic" }}>
                  &ldquo;{comment}&rdquo;
                </p>
              </div>
            );
          })}
        </div>
      )}

      {important.length > 0 && (
        <div style={tierBox("var(--accent-light-bg)", "rgba(181,40,44,0.25)")}>
          {tierHeader("🔴", "Important", "var(--accent-dark)")}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{important.map(termPill)}</div>
        </div>
      )}

      {somewhatFiltered.length > 0 && (
        <div style={tierBox("var(--accent-mid-bg)", "rgba(232,133,45,0.25)")}>
          {tierHeader("🟠", "Somewhat Important", "var(--leda-orange)")}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{somewhatFiltered.map(termPill)}</div>
        </div>
      )}

      {niceFiltered.length > 0 && (
        <div style={tierBox("var(--muted-bg)", "var(--border)")}>
          {tierHeader("🟢", "Nice to Have")}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{niceFiltered.map(termPill)}</div>
        </div>
      )}

      {/* Actions */}
      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        <DownloadButton scholarName={scholarName} topTerms={topTerms} important={important} somewhatFiltered={somewhatFiltered} niceFiltered={niceFiltered} allOther={allOther} homeText={homeText} />
        <EmailButton scholarName={scholarName} topTerms={topTerms} important={important} somewhatFiltered={somewhatFiltered} niceFiltered={niceFiltered} allOther={allOther} />
      </div>

      {topTerms.length === 0 && remaining.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>
          Go back and answer some questions to see your fit profile!
        </div>
      )}
    </div>
  );
}

export default function CollegeFitQuestionnaire() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [importanceRatings, setImportanceRatings] = useState({});
  const [textInputs, setTextInputs] = useState({});
  const [otherComments, setOtherComments] = useState({});
  const [top3Picks, setTop3Picks] = useState([]);
  const [scholarName, setScholarName] = useState("");
  const [aiTerms, setAiTerms] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const section = SECTIONS[currentStep];
  const isIntro = section.id === "intro";
  const isReport = section.id === "report";
  const isPickTop3 = section.id === "pick_top3";
  const isReflect = section.id === "reflect";
  const contentSections = SECTIONS.filter((s) => s.questions);

  // Progress calc
  const totalContentSteps = contentSections.length;
  const currentContentIndex = contentSections.findIndex((s) => s.id === section.id);
  const progress = isIntro ? 0 : isReport ? 100 : ((currentContentIndex + 1) / totalContentSteps) * 100;

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

        :root {
          --bg: #FAFAFA;
          --card-bg: #FFFFFF;
          --text: #1A1A1A;
          --muted: #6B7280;
          --muted-border: #D1D5DB;
          --border: #E5E7EB;
          --accent: #B5282C;
          --accent-dark: #8B1F22;
          --accent-mid: #D4685A;
          --accent-light-bg: #FEF2F2;
          --accent-mid-bg: #FDF6F4;
          --muted-bg: #F3F4F6;
          --selected-bg: #FEF7F6;
          --importance-bg: #FEF7F6;
          --top-terms-bg: #FEF2F2;
          --tag-bg: #E8F5E9;
          --tag-text: #2E7D32;
          --progress-bg: #E5E7EB;
          --progress-fill: #B5282C;
          --leda-green: #4E8542;
          --leda-orange: #E8852D;
          --leda-red: #B5282C;
          --leda-blue: #1B75BC;
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media print {
          body { background: white !important; }
          #report-content { padding: 20px; }
          button, a[href^="mailto"] { display: none !important; }
          div[style*="position: fixed"] { display: none !important; }
          div[style*="position: sticky"] { display: none !important; }
        }

        input::placeholder {
          color: var(--muted);
        }

        textarea::placeholder {
          color: var(--muted);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
      `}</style>

      {/* Progress bar */}
      {!isIntro && (
        <div style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "var(--bg)",
          padding: "12px 20px 0",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
          }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}>
              {isReport ? "Complete!" : isReflect ? "💭 Anything Else?" : isPickTop3 ? "⭐ Your Priorities" : `${section.icon} ${section.title}`}
            </span>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: "var(--muted)",
            }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div style={{
            height: 4,
            borderRadius: 2,
            background: "var(--progress-bg)",
            overflow: "hidden",
            marginBottom: 12,
          }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              background: "var(--progress-fill)",
              borderRadius: 2,
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>
      )}

      {/* Content */}
      <div
        ref={scrollRef}
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "20px 20px 100px",
        }}
      >
        {isIntro && (
          <div style={{
            textAlign: "center",
            paddingTop: 48,
            animation: "fadeSlideIn 0.5s ease",
          }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🧭</div>
            <h1 style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 28,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 14,
              lineHeight: 1.2,
            }}>
              College Fit Finder
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              color: "var(--muted)",
              maxWidth: 420,
              margin: "0 auto 8px",
              lineHeight: 1.6,
            }}>
              This questionnaire will help you discover what matters most to you in a college — and give you the search terms to find your best matches.
            </p>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: "var(--muted)",
              maxWidth: 420,
              margin: "0 auto",
              lineHeight: 1.6,
              fontStyle: "italic",
            }}>
              There are no right answers, and your preferences may change over time. Just go with what feels right today.
            </p>
            <div style={{ maxWidth: 320, margin: "28px auto 0" }}>
              <input
                type="text"
                placeholder="Your full name"
                value={scholarName}
                onChange={(e) => setScholarName(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 16,
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "2px solid var(--border)",
                  background: "var(--card-bg)",
                  color: "var(--text)",
                  outline: "none",
                  textAlign: "center",
                }}
              />
            </div>
            <div style={{
              marginTop: 48,
              paddingTop: 24,
              borderTop: "1px solid var(--border)",
              display: "flex",
              justifyContent: "center",
            }}>
              <img src={LEDA_LOGO} alt="LEDA" style={{ height: 52, objectFit: "contain" }} />
            </div>
          </div>
        )}

        {!isIntro && !isReport && !isPickTop3 && !isReflect && (
          <div style={{ animation: "fadeSlideIn 0.35s ease" }}>
            {section.subtitle && (
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: "var(--muted)",
                marginBottom: 24,
                lineHeight: 1.5,
                fontStyle: "italic",
              }}>
                {section.subtitle}
              </p>
            )}
            {section.questions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                answers={answers}
                setAnswers={setAnswers}
                importanceRatings={importanceRatings}
                setImportanceRatings={setImportanceRatings}
                textInputs={textInputs}
                setTextInputs={setTextInputs}
              />
            ))}
            {section.otherPrompt && (
              <div style={{ marginTop: 8 }}>
                <label style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--muted)",
                  display: "block",
                  marginBottom: 6,
                }}>
                  {section.otherPrompt}
                </label>
                <textarea
                  value={otherComments[section.id] || ""}
                  onChange={(e) =>
                    setOtherComments((prev) => ({ ...prev, [section.id]: e.target.value }))
                  }
                  placeholder="Optional — share anything else on your mind…"
                  rows={2}
                  style={{
                    width: "100%",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "2px solid var(--border)",
                    background: "var(--card-bg)",
                    color: "var(--text)",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>
            )}
          </div>
        )}

        {isReflect && (
          <Reflect
            otherComments={otherComments}
            textInputs={textInputs}
            answers={answers}
            importanceRatings={importanceRatings}
            aiTerms={aiTerms}
            setAiTerms={setAiTerms}
          />
        )}

        {isPickTop3 && (
          <PickTop3
            answers={answers}
            importanceRatings={importanceRatings}
            textInputs={textInputs}
            top3Picks={top3Picks}
            setTop3Picks={setTop3Picks}
            aiTerms={aiTerms}
          />
        )}

        {isReport && (
          <Report
            answers={answers}
            importanceRatings={importanceRatings}
            textInputs={textInputs}
            otherComments={otherComments}
            top3Picks={top3Picks}
            scholarName={scholarName}
            aiTerms={aiTerms}
          />
        )}
      </div>

      {/* Navigation */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
        padding: "14px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 10,
      }}>
        <button
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            padding: "10px 20px",
            borderRadius: 10,
            border: "2px solid var(--border)",
            background: "transparent",
            color: currentStep === 0 ? "var(--muted-border)" : "var(--text)",
            cursor: currentStep === 0 ? "default" : "pointer",
          }}
        >
          ← Back
        </button>

        {/* Step dots */}
        <div style={{ display: "flex", gap: 6 }}>
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(i)}
              style={{
                width: i === currentStep ? 20 : 8,
                height: 8,
                borderRadius: 4,
                border: "none",
                background: i === currentStep ? "var(--accent)" : i < currentStep ? "var(--accent-mid)" : "var(--muted-border)",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentStep((s) => Math.min(SECTIONS.length - 1, s + 1))}
          disabled={(isPickTop3 && top3Picks.length < 3)}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            padding: "10px 24px",
            borderRadius: 10,
            border: "none",
            background: (isPickTop3 && top3Picks.length < 3) ? "var(--muted-border)" : "var(--accent)",
            color: "white",
            cursor: (isPickTop3 && top3Picks.length < 3) ? "default" : "pointer",
          }}
        >
          {isIntro ? "Let's go →" : isReflect ? "Choose my top 3 →" : isPickTop3 ? "See my results →" : isReport ? "Done ✓" : "Next →"}
        </button>
      </div>
    </div>
  );
}

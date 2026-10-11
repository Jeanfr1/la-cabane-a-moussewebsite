#!/usr/bin/env python3
"""Real-ESRGAN x4plus upscaler (RRDBNet, weights loaded with weights_only=True).
Usage: python3 upscale.py <weights.pth> <in.png> <out.png> [outscale=2]
Weights: https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth
Used once to enlarge the real-venue photos cropped from 00-referencias/informacoes.jpg."""
import sys
import cv2
import numpy as np
import torch
from torch import nn
import torch.nn.functional as F


class RDB(nn.Module):
    def __init__(self, nf=64, gc=32):
        super().__init__()
        self.conv1 = nn.Conv2d(nf, gc, 3, 1, 1)
        self.conv2 = nn.Conv2d(nf + gc, gc, 3, 1, 1)
        self.conv3 = nn.Conv2d(nf + 2 * gc, gc, 3, 1, 1)
        self.conv4 = nn.Conv2d(nf + 3 * gc, gc, 3, 1, 1)
        self.conv5 = nn.Conv2d(nf + 4 * gc, nf, 3, 1, 1)
        self.lrelu = nn.LeakyReLU(0.2, True)

    def forward(self, x):
        x1 = self.lrelu(self.conv1(x))
        x2 = self.lrelu(self.conv2(torch.cat((x, x1), 1)))
        x3 = self.lrelu(self.conv3(torch.cat((x, x1, x2), 1)))
        x4 = self.lrelu(self.conv4(torch.cat((x, x1, x2, x3), 1)))
        x5 = self.conv5(torch.cat((x, x1, x2, x3, x4), 1))
        return x5 * 0.2 + x


class RRDB(nn.Module):
    def __init__(self, nf=64, gc=32):
        super().__init__()
        self.rdb1, self.rdb2, self.rdb3 = RDB(nf, gc), RDB(nf, gc), RDB(nf, gc)

    def forward(self, x):
        return self.rdb3(self.rdb2(self.rdb1(x))) * 0.2 + x


class RRDBNet(nn.Module):
    def __init__(self, nb=23, nf=64, gc=32):
        super().__init__()
        self.conv_first = nn.Conv2d(3, nf, 3, 1, 1)
        self.body = nn.Sequential(*[RRDB(nf, gc) for _ in range(nb)])
        self.conv_body = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_up1 = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_up2 = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_hr = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_last = nn.Conv2d(nf, 3, 3, 1, 1)
        self.lrelu = nn.LeakyReLU(0.2, True)

    def forward(self, x):
        feat = self.conv_first(x)
        feat = feat + self.conv_body(self.body(feat))
        feat = self.lrelu(self.conv_up1(F.interpolate(feat, scale_factor=2, mode='nearest')))
        feat = self.lrelu(self.conv_up2(F.interpolate(feat, scale_factor=2, mode='nearest')))
        return self.conv_last(self.lrelu(self.conv_hr(feat)))


def main():
    weights, src, dst = sys.argv[1:4]
    outscale = float(sys.argv[4]) if len(sys.argv) > 4 else 2.0
    net = RRDBNet()
    state = torch.load(weights, map_location='cpu', weights_only=True)
    net.load_state_dict(state.get('params_ema', state), strict=True)
    net.eval()
    dev = 'mps' if torch.backends.mps.is_available() else 'cpu'
    net.to(dev)
    img = cv2.imread(src, cv2.IMREAD_COLOR).astype(np.float32) / 255.0
    h, w = img.shape[:2]
    t = torch.from_numpy(img[:, :, ::-1].copy()).permute(2, 0, 1)[None].to(dev)
    with torch.no_grad():
        out = net(t).clamp(0, 1)[0].permute(1, 2, 0).cpu().numpy()[:, :, ::-1]
    out = (out * 255).round().astype(np.uint8)
    if outscale != 4:
        out = cv2.resize(out, (int(w * outscale), int(h * outscale)), interpolation=cv2.INTER_AREA)
    cv2.imwrite(dst, out)
    print(dst, out.shape, dev)


if __name__ == '__main__':
    main()

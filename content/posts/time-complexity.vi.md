---
title: Trực quan hóa độ phức tạp thuật toán
date: 2026-05-02
category: cs
tags: [Thuật toán, CS]
summary: Ký hiệu Big-O qua ví dụ trực quan và sự đánh đổi trong thực tế.
---

Big-O mô tả lượng công việc của thuật toán **tăng nhanh thế nào** khi dữ liệu đầu vào lớn dần. Nó bỏ qua hằng số và tốc độ máy, chỉ hỏi một câu: *khi n rất lớn thì chuyện gì xảy ra?*

## Các mức tăng trưởng thường gặp

| Ký hiệu | Tên gọi | Gấp đôi n thì… | Ví dụ |
| --- | --- | --- | --- |
| O(1) | hằng số | không đổi | truy cập phần tử mảng |
| O(log n) | logarit | chậm hơn một bước | tìm kiếm nhị phân |
| O(n) | tuyến tính | chậm gấp 2 | duyệt danh sách |
| O(n log n) | tuyến tính-logarit | chậm hơn 2 lần một chút | merge sort |
| O(n²) | bình phương | chậm gấp 4 | so sánh mọi cặp |

## Cảm nhận sự khác biệt

Tìm trong danh sách đã sắp xếp gồm một triệu số:

```python
def linear_search(items, target):          # O(n): tối đa 1.000.000 bước
    for i, x in enumerate(items):
        if x == target:
            return i
    return -1

def binary_search(items, target):          # O(log n): khoảng 20 bước
    lo, hi = 0, len(items) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```

Hai mươi bước so với một triệu bước. Khoảng cách đó là lý do độ phức tạp quan trọng hơn việc đổi sang laptop nhanh hơn.

## Những đánh đổi nên nhớ

1. **Hằng số vẫn tồn tại.** Với dữ liệu nhỏ, vòng lặp O(n²) có thể nhanh hơn thuật toán O(n log n).
2. **Bộ nhớ cũng tính.** Nhiều thuật toán nhanh phải đổi bằng thêm không gian.
3. **Đo trước khi tối ưu.** Big-O cho biết hình dạng; profiler mới cho biết thời gian thật sự đi đâu.

> Mẹo nhanh: thấy vòng lặp lồng nhau trên cùng một dữ liệu, hãy tự hỏi liệu hash map có thay được vòng lặp bên trong không.

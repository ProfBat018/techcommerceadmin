import { useState, ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategorySelector } from "@/components/CategorySelector";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";

interface CreateProductModalProps {
  onClose: () => void;
}

interface ImagePreview {
  file: File;
  url: string;
  isMain: boolean;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({ onClose }) => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [images, setImages] = useState<ImagePreview[]>([]);

  const [editingImage, setEditingImage] = useState<ImagePreview | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages: ImagePreview[] = filesArray.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        isMain: false,
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleSetMainImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isMain: i === index,
      }))
    );
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("price", price);
    selectedCategories.forEach((cat) => formData.append("categories", cat));

    images.forEach((img, index) => {
      formData.append("images", img.file);
      if (img.isMain) {
        formData.append("mainImageIndex", index.toString());
      }
    });

    // здесь отправка formData на API (пример):
    // await axios.post("/api/v1/products", formData)

    console.log("FormData готов к отправке");
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 rounded-xl shadow-xl bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Добавить товар
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Название товара"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание"
          />
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Цена"
          />

          <CategorySelector onChange={setSelectedCategories} />

          <div>
            <label className="block font-medium mb-1">Изображения</label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="flex flex-wrap gap-3 mt-3">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`relative w-20 h-20 border-2 rounded-md overflow-hidden cursor-pointer ${
                    img.isMain ? "border-blue-500" : "border-gray-300"
                  }`}
                >
                  <img
                    src={img.url}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onClick={() => setEditingImage(img)}
                  />
                  {img.isMain && (
                    <div className="absolute bottom-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-tr">
                      Главн.
                    </div>
                  )}
                  <button
                    onClick={() =>
                      setImages((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-bl text-xs px-1 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          {editingImage && (
            <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-lg w-[90vw] h-[80vh] relative">
                <Cropper
                  image={editingImage.url}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, areaPixels) =>
                    setCroppedAreaPixels(areaPixels)
                  }
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setEditingImage(null)}
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={async () => {
                      const cropped = await getCroppedImg(
                        editingImage.url,
                        croppedAreaPixels
                      );
                      const blob = await fetch(cropped).then((r) => r.blob());
                      const file = new File([blob], editingImage.file.name, {
                        type: editingImage.file.type,
                      });
                      setImages((prev) =>
                        prev.map((img) =>
                          img === editingImage
                            ? {
                                ...img,
                                url: cropped,
                                file,
                              }
                            : img
                        )
                      );
                      setEditingImage(null);
                    }}
                  >
                    Сохранить
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Сохранить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductModal;

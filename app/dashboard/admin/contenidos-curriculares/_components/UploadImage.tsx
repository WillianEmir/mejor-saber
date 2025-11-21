import { Button } from "@/src/components/ui/Button"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { FormState } from "@/src/types"
import Image from "next/image"

interface EjeTematicoImageProps {
  imageUrl: string | null | undefined
  itemId: string | undefined
  serverAction: (itemId: string, imageUrl: string) => Promise<FormState>
}

export default function UploadImage({ imageUrl, itemId, serverAction }: EjeTematicoImageProps) {

  const [newImageUrl, setNewImageUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  
  const handleSaveImage = () => { 
    if (!newImageUrl) return

    startTransition(async () => {
      const result = await serverAction(itemId!, newImageUrl)
      if (result.success) {
        toast.success(result.message)
        setNewImageUrl(null)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Imagen</h3>
      <div className="flex items-center gap-4">
        {imageUrl && (
          <div className="relative h-32 w-32">
            <Image src={imageUrl} alt="Imagen actual" className="h-full w-full object-cover rounded-md" width={128} height={128} />
          </div> 
        )}
        {newImageUrl && (
          <div className="relative h-32 w-32">
            <Image src={newImageUrl} alt="Nueva imagen" className="h-full w-full object-cover rounded-md" width={128} height={128} />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => setNewImageUrl(null)}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            >
              <XMarkIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="flex gap-4"> 
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          onSuccess={(results: CloudinaryUploadWidgetResults) => {
            if (results.event === 'success' && typeof results.info !== 'string' && results.info) {
              setNewImageUrl(results.info.secure_url)
            }
          }}
        >
          {({ open }) => {
            return (
              <Button type="button" variant="outline" onClick={() => open()}>
                {imageUrl ? 'Cambiar Imagen' : 'Subir Imagen'}
              </Button>
            )
          }}
        </CldUploadWidget>
        {newImageUrl && (
          <Button onClick={handleSaveImage} disabled={isPending}>
            {isPending ? 'Guardando...' : 'Guardar Imagen'}
          </Button>
        )}
      </div>
    </div>
  )
}

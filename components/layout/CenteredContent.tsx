interface Props {
  size: string,
  children: JSX.Element,
}

export default function CenteredContent({
  size = "sm",
  children,
}: Props) {
  return (
    <div className="row">
      {size === "sm" ? (
        <>
          <div className="col-0 col-md-3"></div>
          <div className="col-12 col-md-6">
            <div className="container">
              {children}
            </div>
          </div>
          <div className="col-0 col-md-3">
          </div>
        </>
      ) : size === "md" ?(
        <>
          <div className="col-0 col-md-2"></div>
          <div className="col-12 col-md-8">
            <div className="container">
              {children}
            </div>
          </div>
          <div className="col-0 col-md-2">
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}
